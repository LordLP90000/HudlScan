FROM vllm/vllm-openai:v0.17.1

# Install Flask and additional dependencies
RUN pip install --no-cache-dir flask flask-cors

# Copy server script
COPY simple_server.py /app/simple_server.py
WORKDIR /app

# Expose API port
EXPOSE 7860

# Set environment variables
ENV MODEL_PATH=rednote-hilab/dots.mocr-svg
ENV PORT=7860
ENV PYTHONUNBUFFERED=1

# Run the server
CMD ["python", "simple_server.py"]
