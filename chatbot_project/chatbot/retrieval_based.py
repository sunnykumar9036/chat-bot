# retrieval_based.py

import json
import os

# Example: Load your dataset once at startup
DATA_FILE = os.path.join(os.path.dirname(__file__), "rrce_dataset_.json")

try:
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
except Exception as e:
    print(f"⚠️ Error loading dataset: {e}")
    dataset = {}

def get_answer(query):
    """
    Returns the best answer for a given query from your dataset.
    Replace this with your actual retrieval logic.
    """
    query_lower = query.strip().lower()

    # Simple rule-based search example
    for item in dataset.get("questions", []):
        question_text = item.get("question", "").lower()
        if query_lower in question_text:
            return item.get("answer", "Sorry, I don't have an answer for that.")

    # Fallback response
    return "Sorry, I don't have an answer for that."
