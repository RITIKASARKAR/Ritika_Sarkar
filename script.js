// Dark Mode
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-mode-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }
});

// Chatbot (only runs on index.html)
async function sendMessage() {
  const input = document.getElementById("user-input");
  if (!input) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  const thinkingMessage = appendMessage("bot", "...");
  let dotCount = 1;
  const typingInterval = setInterval(() => {
    thinkingMessage.textContent = ".".repeat(dotCount++ % 4);
  }, 400);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_KEY" // replace safely
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    clearInterval(typingInterval);
    thinkingMessage.remove();

    const reply = data.choices?.[0]?.message?.content || "⚠️ I couldn't understand.";
    appendMessage("bot", reply);

  } catch (err) {
    clearInterval(typingInterval);
    thinkingMessage.remove();
    appendMessage("bot", "⚠️ Error connecting to API.");
  }
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
