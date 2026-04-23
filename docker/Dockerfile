FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch with CUDA support and transformers
RUN pip install --no-cache-dir \
    torch \
    torchvision \
    transformers>=4.47.0 \
    accelerate \
    pillow \
    flask \
    flask-cors \
    qwen-vl-utils \
    av \
    opencv-python

# Create directory for models
RUN mkdir -p /models

# Copy server script
COPY simple_server.py /app/simple_server.py
WORKDIR /app

# Expose API port
EXPOSE 8000

# Set environment variables
ENV MODEL_PATH=/models/dots.mocr-svg
ENV PORT=8000
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the server
CMD ["python", "simple_server.py"]
