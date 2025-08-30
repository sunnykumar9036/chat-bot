
def chatbot_api(request):
    print(f"Request method: {request.method}")
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            user_query = data.get("query", "")
            print(f"Received query: {user_query}")
            response = get_answer(user_query)
            print(f"Sending response: {response}")
            return JsonResponse({"response": response})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"response": f"⚠️ Error: {str(e)}"})
    elif request.method == "GET":
        return JsonResponse({"response": "Send a POST request with JSON {'query': 'your question'}"})
    return JsonResponse({"response": "Invalid request"}, status=400)
