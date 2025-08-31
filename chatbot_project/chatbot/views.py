from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# import your retrieval model function
from .retrieval_based import get_answer

def amc(request):
    # Renders templates/amc.html
    return render(request, "amc.html")

@csrf_exempt
def chatbot_api(request):
    if request.method != "POST":
        return JsonResponse({"response": "Send POST with JSON {query: '...'}"}, status=400)
    try:
        data = json.loads(request.body.decode("utf-8"))
        query = data.get("query", "").strip()
        if not query:
            return JsonResponse({"response": "Empty query"}, status=400)

        # call your retrieval model:
        answer = get_answer(query)
        return JsonResponse({"response": answer})
    except Exception as e:
        return JsonResponse({"response": f"Error: {str(e)}"}, status=500)
