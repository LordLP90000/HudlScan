#!/usr/bin/env python3
"""
Fine-tune dots.mocr on football playbook data.

Usage: python scripts/finetune_dots_mocr.py <training_data.jsonl> [output_dir]
"""

import json
import sys
from pathlib import Path

import torch
from datasets import Dataset
from transformers import (
    AutoProcessor,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    TrainerCallback
)


class PlaybookDataset(torch.utils.data.Dataset):
    """Dataset for football playbook images and extracted plays."""

    def __init__(self, data_file, processor, max_length=4096):
        self.data = []
        with open(data_file) as f:
            for line in f:
                self.data.append(json.loads(line))

        self.processor = processor
        self.max_length = max_length

        # Build prompt template
        self.prompt_template = """Extract football plays from this playbook image as JSON.
Format: [{"col1": "formation", "col2": "route", "col3": "concept"}]"""

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        from PIL import Image

        item = self.data[idx]

        # Load and process image
        image_path = item["image"]
        try:
            image = Image.open(image_path).convert("RGB")
        except Exception as e:
            print(f"Warning: Could not load image {image_path}: {e}", file=sys.stderr)
            # Return a dummy item
            return {
                "pixel_values": torch.zeros(3, 224, 224),
                "input_ids": torch.zeros(512, dtype=torch.long),
                "labels": torch.zeros(512, dtype=torch.long),
            }

        # Target output JSON
        target_json = json.dumps(item["plays"], indent=None)

        # Process with the model's processor
        inputs = self.processor(
            text=self.prompt_template,
            images=image,
            return_tensors="pt"
        )

        # Tokenize target
        target_ids = self.processor.tokenizer(
            target_json,
            return_tensors="pt",
            max_length=self.max_length,
            truncation=True,
            padding="max_length"
        )

        return {
            "pixel_values": inputs.pixel_values.squeeze(0),
            "input_ids": inputs.input_ids.squeeze(0),
            "labels": target_ids.input_ids.squeeze(0),
        }


class LoggingCallback(TrainerCallback):
    """Callback for logging training progress."""

    def __init__(self):
        self.last_log_step = 0

    def on_log(self, args, state, control, model=None, **kwargs):
        if state.global_step - self.last_log_step >= 10:
            loss = state.log_history[-1].get("loss", "N/A")
            print(f"Step {state.global_step}: Loss = {loss}", file=sys.stderr)
            self.last_log_step = state.global_step


def get_optimal_settings():
    """Detect GPU and return optimal training settings."""
    if not torch.cuda.is_available():
        print("Warning: No CUDA device available. Training will be very slow on CPU.", file=sys.stderr)
        return {
            "use_gpu": False,
            "batch_size": 1,
            "gradient_accumulation": 16,
            "bf16": False,
        }

    vram_gb = torch.cuda.get_device_properties(0).total_memory / 1024**3
    print(f"Detected GPU with {vram_gb:.1f} GB VRAM", file=sys.stderr)

    if vram_gb >= 12:
        return {
            "use_gpu": True,
            "batch_size": 2,
            "gradient_accumulation": 4,
            "bf16": True,
        }
    elif vram_gb >= 8:
        return {
            "use_gpu": True,
            "batch_size": 1,
            "gradient_accumulation": 8,
            "bf16": True,
        }
    else:  # 6GB or less
        return {
            "use_gpu": True,
            "batch_size": 1,
            "gradient_accumulation": 16,
            "bf16": True,
        }


def finetune(
    training_data: str,
    output_dir: str = "./hudlmcr-playbook-final",
    model_path: str = "rednote-hilab/dots.mocr-svg",
    num_epochs: int = 3,
    batch_size: int = None,
    gradient_accumulation: int = None,
    learning_rate: float = 1e-5,
):
    """
    Fine-tune dots.mocr on playbook data.

    Args:
        training_data: Path to training_data.jsonl
        output_dir: Directory to save fine-tuned model
        model_path: Base model to fine-tune
        num_epochs: Number of training epochs
        batch_size: Per-device batch size (auto-detected if None)
        gradient_accumulation: Gradient accumulation steps (auto-detected if None)
        learning_rate: Learning rate
    """
    # Auto-detect optimal settings
    gpu_settings = get_optimal_settings()
    if batch_size is None:
        batch_size = gpu_settings["batch_size"]
    if gradient_accumulation is None:
        gradient_accumulation = gpu_settings["gradient_accumulation"]

    print(f"\n=== Training Configuration ===", file=sys.stderr)
    print(f"Model: {model_path}", file=sys.stderr)
    print(f"GPU: {gpu_settings['use_gpu']}", file=sys.stderr)
    print(f"Batch size: {batch_size}", file=sys.stderr)
    print(f"Gradient accumulation: {gradient_accumulation}", file=sys.stderr)
    print(f"Effective batch size: {batch_size * gradient_accumulation}", file=sys.stderr)
    print(f"BF16: {gpu_settings['bf16']}", file=sys.stderr)
    print(f"==============================\n", file=sys.stderr)

    print(f"Loading model: {model_path}", file=sys.stderr)

    # Load processor and model
    processor = AutoProcessor.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=torch.bfloat16 if gpu_settings["bf16"] else torch.float32,
        device_map="auto",
        trust_remote_code=True
    )

    # Load dataset
    print(f"Loading training data from: {training_data}", file=sys.stderr)
    train_dataset = PlaybookDataset(training_data, processor)
    print(f"Dataset size: {len(train_dataset)} examples", file=sys.stderr)

    if len(train_dataset) < 10:
        print("Warning: Very small dataset. Consider adding more examples.", file=sys.stderr)

    # Split into train/eval (90/10)
    eval_size = max(1, len(train_dataset) // 10)
    train_size = len(train_dataset) - eval_size

    from torch.utils.data import random_split
    train_dataset, eval_dataset = random_split(
        train_dataset,
        [train_size, eval_size],
        generator=torch.Generator().manual_seed(42)
    )

    print(f"Train: {train_size}, Eval: {eval_size}", file=sys.stderr)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=num_epochs,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        gradient_accumulation_steps=gradient_accumulation,
        learning_rate=learning_rate,
        warmup_ratio=0.1,
        logging_steps=5,
        save_steps=50,
        eval_steps=50,
        bf16=gpu_settings["bf16"],
        fp16=not gpu_settings["bf16"] and gpu_settings["use_gpu"],
        gradient_checkpointing=True,
        report_to="none",  # Disable wandb/tensorboard
        save_total_limit=2,
        load_best_model_at_end=True,
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        callbacks=[LoggingCallback()],
    )

    # Train
    print("\n=== Starting training ===", file=sys.stderr)
    trainer.train()

    # Save final model
    print(f"\n=== Saving model to: {output_dir} ===", file=sys.stderr)
    trainer.save_model(output_dir)
    processor.save_pretrained(output_dir)

    print("Training complete!", file=sys.stderr)
    print(f"Model saved to: {output_dir}", file=sys.stderr)
    print(f"\nTo use the fine-tuned model:", file=sys.stderr)
    print(f"  1. Update docker/.env: MODEL_PATH=/models/hudlmcr-playbook-final", file=sys.stderr)
    print(f"  2. Copy model to docker/trained-model/: cp -r {output_dir} docker/trained-model/", file=sys.stderr)
    print(f"  3. Restart: cd docker && docker-compose up -d --build", file=sys.stderr)


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <training_data.jsonl> [output_dir]", file=sys.stderr)
        print(f"\nExample:", file=sys.stderr)
        print(f"  {sys.argv[0]} training_data.jsonl ./hudlmcr-playbook-final", file=sys.stderr)
        sys.exit(1)

    training_data = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "./hudlmcr-playbook-final"

    if not Path(training_data).exists():
        print(f"Error: Training data not found: {training_data}", file=sys.stderr)
        sys.exit(1)

    finetune(training_data, output_dir)


if __name__ == "__main__":
    main()
