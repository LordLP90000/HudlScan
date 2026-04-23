#!/bin/sh
set -e

MODEL_PATH=${MODEL_PATH:-rednote-hilab/dots.mocr-svg}

echo "Starting vLLM with model: $MODEL_PATH"

# Disable FlashAttention by forcing a different backend
export VLLM_ATTENTION_BACKEND=FLASHINFER

exec vllm serve "$MODEL_PATH" \
    --tensor-parallel-size 1 \
    --gpu-memory-utilization 0.55 \
    --max-model-len 4096 \
    --enforce-eager \
    --trust-remote-code \
    --chat-template-content-format string \
    --port 8000 \
    --host 0.0.0.0
