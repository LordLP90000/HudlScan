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
from pathlib import Path
from typing import List, Dict
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForVision2Seq,
    TrainingArguments,
    Trainer,
    default_data_collator
)
from torch.utils.data import Dataset
from PIL import Image

# Paths
TRAINING_DATA = Path(r"C:\Users\anton\HudlScanner\training\aback_training.jsonl")
MODEL_DIR = Path(r"C:\Users\anton\HudlScanner\models\dots.mocr-svg")
OUTPUT_DIR = Path(r"C:\Users\anton\HudlScanner\models\aback_finetuned")
TRAINING_IMAGES = Path(r"C:\Users\anton\HudlScanner\training\images")

# Model config
MODEL_NAME = "google/dots-mocr-svg"  # or local path
MAX_LENGTH = 128
BATCH_SIZE = 2  # Adjust based on GPU memory
GRADIENT_ACCUMULATION_STEPS = 4
NUM_EPOCHS = 10
LEARNING_RATE = 5e-5

class ABackDataset(Dataset):
    """Dataset for A-Back training data."""

    def __init__(self, data: List[Dict], image_dir: Path = None, tokenizer=None, processor=None):
        self.data = data
        self.image_dir = image_dir
        self.tokenizer = tokenizer
        self.processor = processor

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]

        # Create text input from formation + concept
        text_input = f"Formation: {item['formation']}, Concept: {item['concept']}"

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
    if device == "cpu":
        print("WARNING: Training on CPU will be very slow!")
        print("Consider using a GPU or cloud training (HuggingFace Jobs)")

    # Load training data
    print(f"\nLoading training data from: {TRAINING_DATA}")
    data = load_training_data(TRAINING_DATA)
    print(f"Total examples: {len(data)}")

    # Split data
    train_data, eval_data = split_data(data)
    print(f"Train: {len(train_data)}, Eval: {len(eval_data)}")

    # Load model and tokenizer
    print(f"\nLoading model from: {MODEL_DIR}")
    try:
        tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR))
        model = AutoModelForVision2Seq.from_pretrained(
            str(MODEL_DIR),
            torch_dtype=torch.bfloat16 if device == "cuda" else torch.float32
        )
    except Exception as e:
        print(f"Error loading local model: {e}")
        print("Trying to load from HuggingFace Hub...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForVision2Seq.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.bfloat16 if device == "cuda" else torch.float32
        )

    model.to(device)

    # Resize embeddings for new tokens if needed
    tokenizer.add_tokens(["A-Back", "A-Bump", "A-Near", "I-Off", "T-Flip", "T-Wing", "Z-Flip"])
    model.resize_token_embeddings(len(tokenizer))

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
        fp16=device == "cuda",
        bf16=device == "cuda" and torch.cuda.is_bf16_supported(),
        dataloader_num_workers=0,
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

    trainer.train()

    # Save final model
    final_output = OUTPUT_DIR / "final"
    trainer.save_model(str(final_output))
    tokenizer.save_pretrained(str(final_output))

    print(f"\n{'='*60}")
    print(f"Training complete! Model saved to: {final_output}")
    print("="*60)

    # Show training stats
    print("\nTraining history:")
    for log in trainer.state.log_history:
        if "loss" in log:
            epoch = log.get("epoch", "N/A")
            loss = log["loss"]
            print(f"  Epoch {epoch}: Loss = {loss:.4f}")

if __name__ == "__main__":
    main()
