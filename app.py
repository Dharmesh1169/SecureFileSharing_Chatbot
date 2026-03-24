# ============================================================
#   Secure File Sharing Chatbot
#   IBM Internship Project — Task 2
#   Student: [Your Name]
#   College: [Your College Name]
# ============================================================

from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# ---- Grok API Setup ----
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

# Model to use (free tier)
MODEL = "llama-3.3-70b-versatile"

# ---- System Prompt (Boundaries for the chatbot) ----
# This tells the AI what to answer and what to refuse
SYSTEM_PROMPT = """You are a Secure File Sharing Assistant for an IBM Internship Project.
This chatbot was built by a BCA student as part of Task 2 of the internship.

STRICT RULES:
1. You ONLY answer questions related to Secure File Sharing topics.
2. Topics you are allowed to answer include:
   - What is secure file sharing and why it is important
   - Data confidentiality, integrity, and availability (CIA Triad)
   - Authentication and authorisation in file sharing
   - Types of encryption (AES-256, symmetric, asymmetric, RSA)
   - SSL/TLS and HTTPS for secure file transfer
   - End-to-end encryption (E2EE)
   - Hashing and file integrity verification (MD5, SHA-256)
   - Digital signatures
   - Password-protected file sharing
   - VPN and secure file transfers
   - Expiring links and time-limited access
   - Two-factor authentication (2FA) and MFA
   - SFTP, FTP vs SFTP, secure protocols
   - Cloud storage security (Google Drive, OneDrive, Dropbox)
   - Role-Based Access Control (RBAC)
   - PGP encryption for email and files
   - Common threats: phishing, malware, ransomware, MITM attacks, brute force
   - Data breach causes and prevention
   - Best practices for secure file sharing
   - Data privacy laws: GDPR, DPDPA (India)
   - Tools: 7-Zip, VeraCrypt, BitLocker, Bitwarden, ProtonMail, Wireshark
   - Incident response for file security breaches
   - Data Loss Prevention (DLP)
   - Zero Trust Architecture
   - Any other topic directly related to secure file sharing

3. If the user asks ANYTHING outside the topic of Secure File Sharing, reply EXACTLY with this message:
   "I'm sorry, that question is outside my area of expertise. I am specialized in Secure File Sharing only. Please ask me a question about file security, encryption, access control, or data privacy and I will be happy to help!"

4. Never guess or make up answers. Only use accurate, factual information.
5. Keep answers clear and easy to understand for a college student audience.
6. Use bullet points and short paragraphs to make answers readable.
7. Mention real tools and examples wherever possible."""


# ---- Routes ----

@app.route("/")
def index():
    # Renders the main chat page (index.html)
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    try:
        # Get the user's question from the request
        data = request.get_json(silent=True) or {}
        user_question = data.get("question", "").strip()

        # Check if question is empty
        if not user_question:
            return jsonify({"error": "Please type a question before sending."}), 400

        # Send the question to Grok API (via OpenAI-compatible SDK)
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_question}
            ],
            max_tokens=1024,
            temperature=0.3       # Low temperature = more focused, accurate answers
        )

        # Extract the answer text from the API response
        answer = response.choices[0].message.content.strip()

        # Check if the answer is an out-of-scope response
        is_out_of_scope = "outside my area of expertise" in answer.lower()

        return jsonify({
            "answer":       answer,
            "out_of_scope": is_out_of_scope
        })

    except Exception as exc:
        # Return a user-friendly error message if something goes wrong
        return jsonify({"error": f"Something went wrong: {str(exc)}"}), 500


# ---- Run the App ----

if __name__ == "__main__":
    print("=" * 55)
    print("  Secure File Sharing Chatbot")
    print("  IBM Internship Project — Task 2")
    print("=" * 55)
    print("  Server running at: http://localhost:5000")
    print("  Model provider  : Groq API (Free Tier)")
    print(f"  Model           : {MODEL}")
    print("  Press Ctrl+C to stop the server")
    print("=" * 55)
    app.run(debug=True)
