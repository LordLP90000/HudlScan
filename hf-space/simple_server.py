#!/usr/bin/env python3
"""Simple OCR server using vLLM for dots.mocr model"""
import os
import subprocess

# Configuration
MODEL_PATH = os.environ.get('MODEL_PATH', 'rednote-hilab/dots.mocr-svg')
PORT = int(os.environ.get('PORT', 7860))

# Start vLLM server directly
subprocess.run([
    "vllm", "serve", MODEL_PATH,
    "--port", str(PORT),
    "--host", "0.0.0.0",
    "--tensor-parallel-size", "1",
    "--gpu-memory-utilization", "0.8",
    "--max-model-len", "4096",
    "--enforce-eager",
    "--trust-remote-code"
])
