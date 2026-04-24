#!/usr/bin/env python3
import json
import os
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

TRAINING = Path("training")
IMAGES = TRAINING / "images"
OUTPUT = TRAINING / "annotations.jsonl"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(TRAINING), **kwargs)

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path

        # Root -> serve app
        if path == '/':
            path = '/app.html'

        # Image list endpoint
        if path == '/api/images':
            images = sorted([f.name for f in IMAGES.glob("*.png")])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(images).encode())
            return

        # Download endpoint
        if path == '/api/download':
            if OUTPUT.exists():
                with open(OUTPUT, 'rb') as f:
                    data = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/jsonl')
                self.send_header('Content-Disposition', 'attachment; filename="training.jsonl"')
                self.end_headers()
                self.wfile.write(data)
            return

        # Serve files - URL decode the path first
        decoded_path = urllib.parse.unquote(path)
        filepath = TRAINING / decoded_path.lstrip('/')
        if filepath.exists():
            if filepath.suffix == '.png':
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.end_headers()
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                super().do_GET()
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path

        # Mock predict endpoint (return empty for now - you fill in)
        if path == '/api/predict':
            content_length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(content_length))

            # TODO: Call actual model here
            # For now return empty so you can annotate
            result = {
                "formation": "",
                "concept": "",
                "position": "regular",
                "route": "",
                "note": "Model not connected - annotate manually"
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return

        # Save endpoint - now saves multiple plays for an image
        if path == '/api/save':
            content_length = int(self.headers['Content-Length'])
            data = json.loads(self.rfile.read(content_length))

            # Save all plays for this image
            image_name = data.get('image')
            plays = data.get('plays', [])

            for play in plays:
                record = {
                    'image': image_name,
                    'formation': play.get('formation', ''),
                    'concept': play.get('concept', ''),
                    'position': play.get('position', 'regular'),
                    'route': play.get('route', ''),
                }
                with open(OUTPUT, 'a') as f:
                    f.write(json.dumps(record) + '\n')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"ok": True, "saved": len(plays)}).encode())
            return


print("Server running on http://localhost:8888")
print("Open http://localhost:8888/app.html")
HTTPServer(('localhost', 8888), Handler).serve_forever()
