FROM vllm/vllm-openai:v0.17.1

# Install additional dependencies for fine-tuning
RUN pip install transformers accelerate datasets pillow

# Create directory for custom models
RUN mkdir -p /models

# Expose API port
EXPOSE 8000

# Default to dots.mocr pre-trained
# Override with: --mount source=trained-model,target=/models and MODEL_PATH=/models
CMD ["sh", "-c", "vllm serve ${MODEL_PATH:-rednote-hilab/dots.mocr-svg} \
    --tensor-parallel-size 1 \
    --gpu-memory-utilization 0.85 \
    --trust-remote-code \
    --chat-template-content-format string \
    --port 8000 \
    --host 0.0.0.0"]
