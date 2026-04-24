#!/usr/bin/env python3
"""
Fine-tune dots.mocr model on A-Back/Fullback training data.

This script:
1. Loads the training JSONL data
2. Prepares datasets for fine-tuning
3. Runs fine-tuning on GPU (or CPU with warnings)
4. Saves the fine-tuned model
"""

import json
import os
import sys
from pathlib import Path
from typing import List, Dict
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    default_data_collator
)
from torch.utils.data import Dataset

# Paths
TRAINING_DATA = Path(r"C:\Users\anton\HudlScanner\training\aback_training.jsonl")
MODEL_DIR = Path(r"C:\Users\anton\HudlScanner\models\dots.mocr-svg")
OUTPUT_DIR = Path(r"C:\Users\anton\HudlScanner\models\aback_finetuned")

# Model config
MAX_LENGTH = 128
BATCH_SIZE = 2  # Adjust based on GPU memory
GRADIENT_ACCUMULATION_STEPS = 4
NUM_EPOCHS = 10
LEARNING_RATE = 5e-5

# Special A-Back position tokens
SPECIAL_TOKENS = ["A-Back", "A-Bump", "A-Near", "I-Off", "T-Flip", "T-Wing", "Z-Flip", "A-Near-Bump"]


class ABackDataset(Dataset):
    """Dataset for A-Back training data."""

    def __init__(self, data: List[Dict], tokenizer=None):
        self.data = data
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]

        # Create text input from formation + concept
        text_input = f"Formation: {item['formation']}, Concept: {item['concept']}. What is the A-Back route?"

        # Target output: route/action
        target = item['route']

        # Tokenize
        inputs = self.tokenizer(
            text_input,
            max_length=MAX_LENGTH,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        targets = self.tokenizer(
            target,
            max_length=64,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        return {
            "input_ids": inputs["input_ids"].squeeze(),
            "attention_mask": inputs["attention_mask"].squeeze(),
            "labels": targets["input_ids"].squeeze(),
        }


def load_training_data(path: Path) -> List[Dict]:
    """Load training data from JSONL file."""
    data = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line))
    return data


def split_data(data: List[Dict], train_ratio: float = 0.9):
    """Split data into train and eval sets."""
    split_idx = int(len(data) * train_ratio)
    return data[:split_idx], data[split_idx:]


def main():
    print("="*60)
    print("A-Back/Fullback Model Fine-tuning")
    print("="*60)

    # Check device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"\nDevice: {device}")
    if device == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
    else:
        print("WARNING: Training on CPU will be very slow!")

    # Load training data
    print(f"\nLoading training data from: {TRAINING_DATA}")
    data = load_training_data(TRAINING_DATA)
    print(f"Total examples: {len(data)}")

    # Split data
    train_data, eval_data = split_data(data)
    print(f"Train: {len(train_data)}, Eval: {len(eval_data)}")

    # Load tokenizer
    print(f"\nLoading tokenizer from: {MODEL_DIR}")
    tokenizer = AutoTokenizer.from_pretrained(
        str(MODEL_DIR),
        trust_remote_code=True
    )

    # Add special tokens for A-Back positions
    tokenizer.add_special_tokens({"additional_special_tokens": SPECIAL_TOKENS})
    print(f"Added {len(SPECIAL_TOKENS)} special tokens: {SPECIAL_TOKENS}")

    # Load model using AutoModelForCausalLM with trust_remote_code
    # The dots.mocr model extends Qwen2ForCausalLM
    print(f"\nLoading DotsOCR model from: {MODEL_DIR}")

    # Try loading as Qwen2ForCausalLM since DotsOCR extends it
    from transformers.models.qwen2 import Qwen2ForCausalLM

    # First load the config to get the architecture info
    from transformers import AutoConfig
    config = AutoConfig.from_pretrained(str(MODEL_DIR), trust_remote_code=True)
    print(f"Config arch: {config.architectures}")

    # Load the model - it should work with AutoModelForCausalLM since it's a Qwen2 variant
    model = AutoModelForCausalLM.from_pretrained(
        str(MODEL_DIR),
        trust_remote_code=True,
        torch_dtype=torch.bfloat16 if device == "cuda" else torch.float32,
        # Don't load vision tower for text-only training
        ignore_mismatched_sizes=True
    )

    # Resize embeddings for new tokens
    model.resize_token_embeddings(len(tokenizer))
    print(f"Token vocab size: {len(tokenizer)}")
    print(f"Model embeddings resized: {model.get_input_embeddings().weight.shape[0]}")

    model.to(device)

    # Create datasets
    train_dataset = ABackDataset(train_data, tokenizer=tokenizer)
    eval_dataset = ABackDataset(eval_data, tokenizer=tokenizer)

    # Training arguments
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    training_args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        num_train_epochs=NUM_EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        gradient_accumulation_steps=GRADIENT_ACCUMULATION_STEPS,
        learning_rate=LEARNING_RATE,
        warmup_steps=50,
        logging_steps=10,
        save_steps=50,
        eval_steps=50,
        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        report_to=["tensorboard"],
        fp16=False,
        bf16=device == "cuda" and torch.cuda.is_bf16_supported(),
        dataloader_num_workers=0,
        logging_dir=str(OUTPUT_DIR / "logs"),
        remove_unused_columns=False,
    )

    # Create trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=default_data_collator,
    )

    # Train
    print("\n" + "="*60)
    print("Starting training...")
    print("="*60)
    print(f"Effective batch size: {BATCH_SIZE * GRADIENT_ACCUMULATION_STEPS}")
    print(f"Total steps: {len(train_dataset) // BATCH_SIZE * NUM_EPOCHS}")

    trainer.train()

    # Save final model
    final_output = OUTPUT_DIR / "final"
    final_output.mkdir(parents=True, exist_ok=True)
    trainer.save_model(str(final_output))
    tokenizer.save_pretrained(str(final_output))

    print(f"\n{'='*60}")
    print(f"Training complete! Model saved to: {final_output}")
    print("="*60)

    # Show training stats
    print("\nTraining history:")
    train_losses = []
    for log in trainer.state.log_history:
        if "loss" in log:
            epoch = log.get("epoch", "N/A")
            loss = log["loss"]
            train_losses.append(loss)
            print(f"  Epoch {epoch:.2f}: Loss = {loss:.4f}")

    if train_losses:
        print(f"\nFinal loss: {train_losses[-1]:.4f}")
        print(f"Loss reduction: {train_losses[0] - train_losses[-1]:.4f}")


if __name__ == "__main__":
    main()
