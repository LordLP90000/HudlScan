#!/usr/bin/env python3
"""
Initialize SQLite database for playbook training data.
This stores uploaded images, extractions, and training history.
"""

import sqlite3
import sys
from pathlib import Path
from datetime import datetime


def init_database(db_path: str = "hudlscanner.db"):
    """Create database schema."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Images table - stores uploaded playbook images
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            position TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            file_hash TEXT UNIQUE,
            page_number INTEGER,
            source TEXT DEFAULT 'upload'
        )
    """)

    # Extractions table - stores model outputs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS extractions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id INTEGER NOT NULL,
            model_name TEXT NOT NULL,
            raw_response TEXT NOT NULL,
            extracted_plays TEXT NOT NULL,
            play_count INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (image_id) REFERENCES images (id)
        )
    """)

    # Verifications table - stores human-verified extractions for training
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS verified_extractions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id INTEGER NOT NULL,
            verified_plays TEXT NOT NULL,
            verified_by TEXT DEFAULT 'manual',
            verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            notes TEXT,
            used_for_training BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (image_id) REFERENCES images (id)
        )
    """)

    # Training runs table - track training history
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS training_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_name TEXT NOT NULL,
            base_model TEXT NOT NULL,
            training_data_count INTEGER NOT NULL,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            epochs INTEGER,
            final_loss REAL,
            model_path TEXT,
            status TEXT DEFAULT 'running'
        )
    """)

    # Reference images table - static images like route tree
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reference_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            file_path TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Indexes for performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_images_position ON images(position)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_extractions_image ON extractions(image_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_verified_training ON verified_extractions(used_for_training)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_training_status ON training_runs(status)")

    conn.commit()
    conn.close()

    print(f"Database initialized: {db_path}", file=sys.stderr)


def add_reference_image(db_path: str, name: str, file_path: str, category: str, description: str = ""):
    """Add a reference image (like route tree)."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT OR REPLACE INTO reference_images (name, file_path, category, description) VALUES (?, ?, ?, ?)",
            (name, file_path, category, description)
        )
        conn.commit()
        print(f"Added reference image: {name}", file=sys.stderr)
    except sqlite3.Error as e:
        print(f"Error adding reference image: {e}", file=sys.stderr)
    finally:
        conn.close()


def main():
    db_path = sys.argv[1] if len(sys.argv) > 1 else "hudlscanner.db"

    init_database(db_path)

    # Add route tree reference if provided
    if len(sys.argv) > 2:
        add_reference_image(
            db_path,
            "route_tree_legend",
            sys.argv[2],
            "legend",
            "Route tree reference for understanding play diagrams"
        )


if __name__ == "__main__":
    main()
