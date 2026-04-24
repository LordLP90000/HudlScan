FROM vllm/vllm-openai:v0.17.1

# Install additional dependencies (ignore blinker conflict)
RUN pip install --no-cache-dir --ignore-installed blinker \
    flask \
    flask-cors \
    qwen-vl-utils

# Create directory for models
RUN mkdir -p /models /app

# Add config patcher script
RUN cat > /app/patch_config.py << 'EOF'
import json
import os
import sys

model_path = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('MODEL_PATH', 'rednote-hilab/dots.mocr-svg')
config_file = os.path.join(model_path, 'config.json')

if os.path.exists(config_file):
    with open(config_file, 'r') as f:
        config = json.load(f)
    
    if 'vision_config' in config and 'attn_implementation' in config['vision_config']:
        print(f"Patching {config_file}: flash_attention_2 -> eager")
        config['vision_config']['attn_implementation'] = 'eager'
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
EOF

# Copy server script
COPY simple_server.py /app/simple_server.py

# Patch config at startup
RUN printf '#!/bin/sh\nexec python3 /app/simple_server.py' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

WORKDIR /app

# Expose API port
EXPOSE 8000

# Set environment variables
ENV MODEL_PATH=/models/dots.mocr-svg
ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV TRANSFORMERS_USE_FLASH_ATTENTION=false
ENV FLASH_ATTENTION_SKIP_KERNEL_CACHE=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the server with config patching
ENTRYPOINT ["/app/entrypoint.sh"]
