from flask import Flask, request, jsonify
from flask_cors import CORS
from rag_agent import get_initial_recommendation, handle_rag_query

app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    profile = data.get("profile")
    if not profile:
        return jsonify({"error": "No profile provided"}), 400
    recommendation = get_initial_recommendation(profile)
    return jsonify(recommendation)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    query = data.get("query")
    profile = data.get("profile")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    # Call your LangChain Groq-powered handler
    response = handle_rag_query(query, profile)
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=7000, debug=True)