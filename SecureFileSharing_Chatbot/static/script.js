// ============================================================
//   Secure File Sharing Chatbot
//   IBM Internship Project — Frontend JavaScript
// ============================================================

// Get references to HTML elements
const chatMessages = document.getElementById("chat-messages");
const userInput    = document.getElementById("user-input");
const sendBtn      = document.getElementById("send-btn");

// Set the time on the welcome message
document.getElementById("welcome-time").textContent = getTime();

// ---- UTILITY: Get current time as HH:MM ----
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour:   "2-digit",
    minute: "2-digit",
  });
}

// ---- UTILITY: Scroll chat to the bottom ----
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ---- UTILITY: Convert basic markdown to HTML ----
// Handles **bold**, *italic*, newlines, and bullet points
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/\n\n/g,          "<br><br>")
    .replace(/\n/g,            "<br>")
    .replace(/•\s/g,           "• ");
}

// ---- ADD USER MESSAGE to the chat ----
function addUserMessage(text) {
  const row = document.createElement("div");
  row.className = "message-row user-row";

  // User avatar
  const avatar = document.createElement("div");
  avatar.className   = "msg-avatar user-avatar";
  avatar.textContent = "You";

  // Message bubble
  const bubble = document.createElement("div");
  bubble.className = "bubble user-bubble";
  bubble.innerHTML = `${formatText(text)}<span class="msg-time">${getTime()}</span>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

// ---- ADD BOT MESSAGE to the chat ----
// type can be: "normal", "out_of_scope", or "error"
function addBotMessage(text, type = "normal") {
  const row = document.createElement("div");
  row.className = "message-row bot-row";

  // Bot avatar
  const avatar = document.createElement("div");
  avatar.className   = "msg-avatar bot-avatar";
  avatar.textContent = "SFS";

  // Message bubble — colour changes based on type
  const bubble = document.createElement("div");
  if (type === "out_of_scope") {
    bubble.className = "bubble bot-bubble out-of-scope-bubble";
  } else if (type === "error") {
    bubble.className = "bubble bot-bubble error-bubble";
  } else {
    bubble.className = "bubble bot-bubble";
  }

  bubble.innerHTML = `${formatText(text)}<span class="msg-time">${getTime()}</span>`;

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

// ---- SHOW typing indicator (3 animated dots) ----
function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot-row";
  row.id        = "typing-indicator";

  const avatar = document.createElement("div");
  avatar.className   = "msg-avatar bot-avatar";
  avatar.textContent = "SFS";

  const bubble = document.createElement("div");
  bubble.className = "bubble bot-bubble typing-bubble";
  bubble.innerHTML = `
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

// ---- HIDE typing indicator ----
function hideTyping() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

// ---- MAIN: Send user message to Flask backend ----
async function sendMessage() {
  const question = userInput.value.trim();
  if (!question) return; // Do nothing if input is empty

  // Show user message and clear input
  addUserMessage(question);
  userInput.value      = "";
  userInput.style.height = "auto";
  sendBtn.disabled     = true; // Disable button while waiting

  // Show the typing animation
  showTyping();

  try {
    // POST request to the Python Flask /ask route
    const response = await fetch("/ask", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ question: question }),
    });

    const data = await response.json();
    hideTyping();

    // Display the response based on its type
    if (data.error) {
      addBotMessage("⚠️ Error: " + data.error, "error");
    } else if (data.out_of_scope) {
      addBotMessage(data.answer, "out_of_scope");
    } else {
      addBotMessage(data.answer, "normal");
    }

  } catch (err) {
    // Network error — Flask server might not be running
    hideTyping();
    addBotMessage(
      "❌ Connection error. Please make sure the Python Flask server is running.\n\nRun this command in your terminal:\n**python app.py**",
      "error"
    );
  }

  // Re-enable send button and put focus back on input
  sendBtn.disabled = false;
  userInput.focus();
}

// ---- EVENT LISTENERS ----

// Click the Send button
sendBtn.addEventListener("click", sendMessage);

// Press Enter key to send (Shift+Enter = new line)
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize the textarea as user types
userInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 110) + "px";
});
