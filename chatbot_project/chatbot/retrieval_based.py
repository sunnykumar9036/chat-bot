import json
import os
from difflib import SequenceMatcher

# Use your dataset file
DATA_FILE = os.path.join(os.path.dirname(__file__), "rrce_dataset_updated.json")

def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def find_best_match(query, data):
    best_match = None
    highest_score = 0

    for item in data:
        score = SequenceMatcher(None, query.lower(), item["question"].lower()).ratio()
        if score > highest_score:
            highest_score = score
            best_match = item

    if highest_score > 0.6:  # similarity threshold
        return best_match["answer"]
    return "I'm not sure about that yet, but I'm learning!"
