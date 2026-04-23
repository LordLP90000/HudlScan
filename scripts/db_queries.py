#!/usr/bin/env python3
"""
Database queries for the training pipeline.
"""

import sqlite3
import json
import sys
from pathlib import Path
from typing import List, Dict, Optional


class TrainingDatabase:
    """Interface to the HudlScanner training database."""

    def __init__(self, db_path: str = "hudlscanner.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row

    def close(self):
        self.conn.close()

    def add_image(self, filename: str, file_path: str, position: str,
                  page_number: Optional[int] = None, source: str = "upload") -> int:
        """Add an uploaded image to the database."""
        cursor = self.conn.cursor()
        cursor.execute(
            """INSERT INTO images (filename, file_path, position, page_number, source)
               VALUES (?, ?, ?, ?, ?)""",
            (filename, file_path, position, page_number, source)
        )
        self.conn.commit()
        return cursor.lastrowid

    def add_extraction(self, image_id: int, model_name: str,
                      raw_response: str, extracted_plays: List[Dict]) -> int:
        """Add an extraction result."""
        cursor = self.conn.cursor()
        cursor.execute(
            """INSERT INTO extractions (image_id, model_name, raw_response, extracted_plays, play_count)
               VALUES (?, ?, ?, ?, ?)""",
            (image_id, model_name, raw_response, json.dumps(extracted_plays), len(extracted_plays))
        )
        self.conn.commit()
        return cursor.lastrowid

    def verify_extraction(self, image_id: int, verified_plays: List[Dict],
                         verified_by: str = "manual", notes: str = "") -> int:
        """Mark an extraction as verified (for training data)."""
        cursor = self.conn.cursor()
        cursor.execute(
            """INSERT INTO verified_extractions (image_id, verified_plays, verified_by, notes)
               VALUES (?, ?, ?, ?)""",
            (image_id, json.dumps(verified_plays), verified_by, notes)
        )
        self.conn.commit()
        return cursor.lastrowid

    def get_unverified_images(self, position: Optional[str] = None,
                             limit: int = 100) -> List[Dict]:
        """Get images that haven't been verified yet."""
        cursor = self.conn.cursor()

        if position:
            cursor.execute(
                """SELECT i.* FROM images i
                   LEFT JOIN verified_extractions v ON i.id = v.image_id
                   WHERE i.position = ? AND v.id IS NULL
                   ORDER BY i.uploaded_at DESC
                   LIMIT ?""",
                (position, limit)
            )
        else:
            cursor.execute(
                """SELECT i.* FROM images i
                   LEFT JOIN verified_extractions v ON i.id = v.image_id
                   WHERE v.id IS NULL
                   ORDER BY i.uploaded_at DESC
                   LIMIT ?""",
                (limit,)
            )

        return [dict(row) for row in cursor.fetchall()]

    def export_training_data(self, output_file: str,
                            unused_only: bool = True) -> int:
        """Export verified extractions to JSONL for training."""
        cursor = self.conn.cursor()

        if unused_only:
            cursor.execute(
                """SELECT i.file_path, v.verified_plays, i.position
                   FROM verified_extractions v
                   JOIN images i ON v.image_id = i.id
                   WHERE v.used_for_training = FALSE"""
            )
        else:
            cursor.execute(
                """SELECT i.file_path, v.verified_plays, i.position
                   FROM verified_extractions v
                   JOIN images i ON v.image_id = i.id"""
            )

        count = 0
        with open(output_file, "w") as f:
            for row in cursor.fetchall():
                f.write(json.dumps({
                    "image": row[0],
                    "plays": json.loads(row[1]),
                    "position": row[2]
                }) + "\n")
                count += 1

        # Mark as used
        if unused_only:
            cursor.execute(
                """UPDATE verified_extractions SET used_for_training = TRUE
                   WHERE used_for_training = FALSE"""
            )
            self.conn.commit()

        print(f"Exported {count} training examples to {output_file}", file=sys.stderr)
        return count

    def start_training_run(self, model_name: str, base_model: str,
                          data_count: int, epochs: int) -> int:
        """Record the start of a training run."""
        cursor = self.conn.cursor()
        cursor.execute(
            """INSERT INTO training_runs (model_name, base_model, training_data_count, epochs, status)
               VALUES (?, ?, ?, ?, 'running')""",
            (model_name, base_model, data_count, epochs)
        )
        self.conn.commit()
        return cursor.lastrowid

    def complete_training_run(self, run_id: int, model_path: str,
                             final_loss: Optional[float] = None):
        """Mark a training run as complete."""
        cursor = self.conn.cursor()
        cursor.execute(
            """UPDATE training_runs
               SET completed_at = CURRENT_TIMESTAMP, model_path = ?, final_loss = ?, status = 'completed'
               WHERE id = ?""",
            (model_path, final_loss, run_id)
        )
        self.conn.commit()

    def get_reference_image(self, name: str) -> Optional[Dict]:
        """Get a reference image (like route tree)."""
        cursor = self.conn.cursor()
        cursor.execute(
            "SELECT * FROM reference_images WHERE name = ?",
            (name,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

    def get_stats(self) -> Dict:
        """Get database statistics."""
        cursor = self.conn.cursor()

        stats = {}

        cursor.execute("SELECT COUNT(*) FROM images")
        stats["total_images"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM extractions")
        stats["total_extractions"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM verified_extractions")
        stats["verified_extractions"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM verified_extractions WHERE used_for_training = FALSE")
        stats["unverified_for_training"] = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM training_runs WHERE status = 'completed'")
        stats["completed_training_runs"] = cursor.fetchone()[0]

        return stats


def main():
    """CLI interface for database operations."""
    if len(sys.argv) < 2:
        print("Usage: python scripts/db_queries.py <command> [args...]", file=sys.stderr)
        print("\nCommands:", file=sys.stderr)
        print("  add-image <filename> <filepath> <position>  - Add an image", file=sys.stderr)
        print("  export-training <output.jsonl>            - Export training data", file=sys.stderr)
        print("  stats                                      - Show database stats", file=sys.stderr)
        print("  unverified [position] [limit]             - List unverified images", file=sys.stderr)
        sys.exit(1)

    db = TrainingDatabase()
    command = sys.argv[1]

    try:
        if command == "add-image":
            if len(sys.argv) < 5:
                raise ValueError("Missing arguments")
            image_id = db.add_image(sys.argv[2], sys.argv[3], sys.argv[4])
            print(f"Added image with ID: {image_id}")

        elif command == "export-training":
            output_file = sys.argv[2] if len(sys.argv) > 2 else "training_data.jsonl"
            count = db.export_training_data(output_file)
            print(f"Exported {count} examples")

        elif command == "stats":
            stats = db.get_stats()
            for key, value in stats.items():
                print(f"{key}: {value}")

        elif command == "unverified":
            position = sys.argv[2] if len(sys.argv) > 2 else None
            limit = int(sys.argv[3]) if len(sys.argv) > 3 else 20
            images = db.get_unverified_images(position, limit)
            for img in images:
                print(f"[{img['id']}] {img['filename']} - {img['position']}")

        else:
            print(f"Unknown command: {command}", file=sys.stderr)
            sys.exit(1)

    finally:
        db.close()


if __name__ == "__main__":
    main()
