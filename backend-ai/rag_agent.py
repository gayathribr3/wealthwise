import os
from langchain.vectorstores import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import TextLoader, JSONLoader
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

def get_initial_recommendation(profile):
    """
    Computes a fixed allocation based on risk appetite.
    This function does NOT use an LLM for the main calculation to ensure consistency.
    """
    risk = profile.get('risk_appetite', 'Medium').lower()
    income = profile.get('monthly_income', 0)
    expenses = profile.get('monthly_expense', 0)
    investable_amount = income - expenses

    if risk == 'high':
        allocations = {"Stocks": 0.70, "Mutual Funds": 0.20, "Fixed Deposits": 0.10}
        explanation = "Based on a high-risk appetite, this portfolio is aggressively weighted towards stocks to maximize growth."
    elif risk == 'low':
        allocations = {"Stocks": 0.10, "Mutual Funds": 0.40, "Fixed Deposits": 0.50}
        explanation = "This portfolio prioritizes capital preservation by focusing on fixed deposits, suitable for a low-risk tolerance."
    else:  # Medium risk
        allocations = {"Stocks": 0.40, "Mutual Funds": 0.40, "Fixed Deposits": 0.20}
        explanation = "A balanced portfolio for a medium-risk appetite, blending stock market growth with the stability of fixed income."

    expected_return = (allocations['Stocks'] * 12.0) + (allocations['Mutual Funds'] * 9.5) + (allocations['Fixed Deposits'] * 6.5)

    return {
        "allocations": allocations,
        "monthly_investable_inr": max(0, investable_amount),
        "expected_annual_return_pct": round(expected_return, 2),
        "explanation": explanation
    }

def _get_qa_chain():
    """
    Builds and returns the RAG chain using langchain_groq.
    In a real app, you might want to cache this object to avoid rebuilding it on every request.
    """
    if not os.getenv("GROQ_API_KEY"):
         raise ValueError("GROQ_API_KEY is not set in the .env file.")

    # Load documents from JSON and TXT files
    json_loader = JSONLoader(file_path="market_data.json", jq_schema='.', text_content=False)
    text_loader = TextLoader("profile_guide.txt")
    docs = json_loader.load() + text_loader.load()

    # Split documents into smaller chunks for processing
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(docs)

    # Create embeddings and the vector store
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    vectorstore = FAISS.from_documents(split_docs, embeddings)

    # Initialize the ChatGroq LLM
    llm = ChatGroq(
        model="deepseek-r1-distill-llama-70b",
        temperature=0.7,
        max_tokens=1024,         # Set an upper limit on token generation
        reasoning_format="parsed",
        timeout=30,             # Timeout after 30 seconds
        max_retries=2
    )
    return RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vectorstore.as_retriever())

def handle_rag_query(query, profile):
    """
    Answers conversational queries using the RAG chain with LangChain Groq.
    Filters out banned phrases and sends a query enriched with user context.
    """
    banned_phrases = ["weather", "sports", "joke", "movie", "politics", "history", "science"]
    if any(phrase in query.lower() for phrase in banned_phrases):
        return {"response": "I can only answer questions about financial investments."}

    try:
        qa_chain = _get_qa_chain()
        
        # CORRECTED: A more conversational prompt with a clear persona
        contextual_query = f"""
        You are a friendly and helpful financial assistant. Your name is FinBot.
        Your goal is to explain investment concepts to the user in a clear, conversational, and encouraging way.
        Use the provided investment guide and market data to answer the user's question based on their profile.

        Here is the user's financial profile: {profile}.
        And here is their question: '{query}'.

        Address the user by their name if it is available in their profile.
        """
        
        print("Sending improved query to LangChain Groq:", contextual_query)
        result = qa_chain.invoke({"query": contextual_query})
        print("Received result from LangChain Groq:", result)
        return {"response": result.get('result', 'Could not process the query.')}
    except Exception as e:
        print(f"An error occurred in handle_rag_query: {e}")
        return {"response": "An error occurred while processing your request."}