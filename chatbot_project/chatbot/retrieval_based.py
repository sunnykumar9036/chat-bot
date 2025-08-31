import json
import re
from pathlib import Path
from nltk.stem import PorterStemmer

BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "rrce_dataset_updated.json"

ps = PorterStemmer()

# Load dataset (expects a list of Q/A dicts)
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    try:
        DATA = json.load(f)
        # If the JSON is a dict with key "questions" adjust accordingly.
        if isinstance(DATA, dict) and "questions" in DATA:
            QA = DATA["questions"]
        else:
            QA = DATA
    except Exception:
        QA = []

def normalize(text):
    text = text.lower()
    tokens = re.findall(r"\w+", text)
    return " ".join(ps.stem(t) for t in tokens)

# Build a simple index (question_norm -> answer)
INDEX = []
for item in QA:
    q = item.get("question") or item.get("q") or ""
    a = item.get("answer") or item.get("a") or item.get("response") or ""
    INDEX.append((normalize(q), a))

def get_answer(query: str) -> str:
    qn = normalize(query)
    # exact substring match first
    for ques, ans in INDEX:
        if qn and ques and qn in ques:
            return ans

    # fallback: token-overlap score
    qset = set(qn.split())
    best_ans = None
    best_score = 0
    for ques, ans in INDEX:
        score = len(qset & set(ques.split()))
        if score > best_score:
            best_score = score
            best_ans = ans

    if best_score > 0:
        return best_ans

    return "Sorry, I don't know the answer to that yet."
