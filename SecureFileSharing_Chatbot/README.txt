============================================================
  SECURE FILE SHARING CHATBOT
  IBM Internship Project — Task 2
  Student: [Your Name]
  College: [Your College Name]
============================================================

ABOUT THE PROJECT
-----------------
This chatbot answers questions related to Secure File Sharing.
It uses the Groq API (free) with the Llama 3.3 70B model to
generate intelligent, accurate responses.

If a user asks anything outside the topic of Secure File Sharing,
the chatbot politely refuses and asks the user to stay on topic.

TECH STACK
----------
  Backend  : Python + Flask
  Frontend : HTML + CSS + JavaScript
  AI Model : Llama 3.3 70B (via Groq API — Free Tier)

PROJECT STRUCTURE
-----------------
  SecureFileSharing_Chatbot/
  ├── app.py                  ← Main Python Flask file (backend)
  ├── .env                    ← Your Groq API key goes here
  ├── requirements.txt        ← Python packages needed
  ├── README.txt              ← This file
  ├── templates/
  │   └── index.html          ← Main chat page (HTML)
  └── static/
      ├── style.css           ← Styling (CSS)
      └── script.js           ← Chat logic (JavaScript)

SETUP INSTRUCTIONS
------------------

STEP 1 — Get your FREE Groq API Key
  1. Open https://console.groq.com in your browser
  2. Create a free account
  3. Go to "API Keys" → "Create API Key"
  4. Copy the key

STEP 2 — Add your API Key
  Open the .env file and replace the placeholder:
    GROQ_API_KEY=your_groq_api_key_here
  Change it to your actual key:
    GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

STEP 3 — Install required Python packages
  Open a terminal in this folder and run:
    pip install -r requirements.txt

STEP 4 — Run the chatbot
  In the terminal, run:
    python app.py

STEP 5 — Open in browser
  Go to:
    http://localhost:5000

HOW TO USE
----------
  - Type any question about Secure File Sharing in the input box
  - Press Enter or click the Send button
  - The bot will reply with a clear, detailed answer
  - If you ask something off-topic, the bot will refuse and redirect you

SAMPLE QUESTIONS YOU CAN ASK
------------------------------
  1.  What is secure file sharing?
  2.  What is AES-256 encryption?
  3.  How does SFTP differ from FTP?
  4.  What is end-to-end encryption?
  5.  How do I share a file securely via email?
  6.  What is two-factor authentication?
  7.  What is a man-in-the-middle attack?
  8.  How does ransomware affect file sharing?
  9.  What is the principle of least privilege?
  10. What is GDPR and how does it affect file sharing?
  11. How does a VPN secure file transfers?
  12. What is PGP encryption?
  13. What are expiring links and why are they useful?
  14. How do I verify file integrity using a hash?
  15. What is zero trust architecture?

============================================================
