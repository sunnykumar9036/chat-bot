from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .retrieval_based import load_data, find_best_match

qa_data = load_data()  # load dataset once

@csrf_exempt
def chatbot_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            query = data.get("query", "")

            # 🔎 Run retrieval
            response = find_best_match(query, qa_data)

            return JsonResponse({"response": response})
        except Exception as e:
            return JsonResponse({"response": f"⚠️ Error: {str(e)}"}, status=400)

    return JsonResponse({"response": "Invalid request method"}, status=405)

from django.shortcuts import render

def amc(request):
    return render(request, "amc.html")

