// ========= CSRF Helper =========
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// ========= Login / Logout =========
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && password) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("studentName", username);

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("portalPage").style.display = "flex";

    openSection("chatSection");
    loadProfile();
    newChat();
  } else {
    alert("⚠️ Please enter both username and password.");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  document.getElementById("portalPage").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
}

// ========= Section Switching =========
function openSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  const selected = document.getElementById(sectionId);
  if (selected) selected.style.display = "block";

  if (sectionId === "profileSection") loadProfile();
}

// ========= Chatbot =========
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
let currentChat = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  try {
    let response = await fetch("/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      body: JSON.stringify({ query: message })
    });

    let data = await response.json();
    addMessage("bot", data.response || "⚠️ Sorry, something went wrong.");
    saveCurrentChat();
  } catch (error) {
    addMessage("bot", "⚠️ Network error!");
  }
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  currentChat.push({ sender, text });
}

function saveCurrentChat() {
  if (currentChat.length > 0) {
    chatHistory.push(currentChat);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    currentChat = [];
  }
}

function newChat() {
  currentChat = [];
  document.getElementById("chatBox").innerHTML =
    '<div class="message bot">Hello! I am your Hybrid Chatbot. How can I help you today?</div>';
}

function showHistory() {
  const historyBox = document.getElementById("chatHistory");
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  chatHistory.forEach((chat, index) => {
    const li = document.createElement("li");
    li.textContent = "Chat " + (index + 1);
    li.onclick = () => loadChat(index);
    list.appendChild(li);
  });

  historyBox.style.display = historyBox.style.display === "none" ? "block" : "none";
}

function loadChat(index) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  chatHistory[index].forEach(msg => addMessage(msg.sender, msg.text));
}

// ========= Profile =========
function loadProfile() {
  const name = localStorage.getItem("studentName") || "Student";
  document.getElementById("welcomeMessage").innerText = "Welcome, " + name;
  document.getElementById("studentNameDisplay").innerText = "Name: " + name;
}

function toggleEditName() {
  const input = document.getElementById("editNameInput");
  const saveBtn = document.getElementById("saveNameBtn");
  const editBtn = document.getElementById("editNameBtn");

  input.style.display = "block";
  saveBtn.style.display = "inline-block";
  editBtn.style.display = "none";
  input.value = localStorage.getItem("studentName") || "";
}

function saveName() {
  const input = document.getElementById("editNameInput");
  const newName = input.value.trim();

  if (newName) {
    localStorage.setItem("studentName", newName);
    loadProfile();
  }

  input.style.display = "none";
  document.getElementById("saveNameBtn").style.display = "none";
  document.getElementById("editNameBtn").style.display = "inline-block";
}

// ========= Auto-login =========
window.onload = function() {
  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("portalPage").style.display = "flex";
    openSection("chatSection");
    loadProfile();
    newChat();
  }

  // Allow Enter key to send
  const input = document.getElementById("userInput");
  if (input) {
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }
};
