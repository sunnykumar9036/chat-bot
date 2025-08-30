// ===== Login =====
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
    newChat(); // Start a fresh chat on login
  } else {
    alert("Please enter both username and password.");
  }
}

// ===== Logout =====
function logout() {
  localStorage.removeItem("loggedIn");
  document.getElementById("portalPage").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
}

// ===== Section Switching =====
function openSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  const selected = document.getElementById(sectionId);
  if (selected) selected.style.display = "block";

  if (sectionId === "profileSection") loadProfile();
}

// ===== Chatbot Logic =====
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
let currentChat = [];

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  fetch("/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: message })
  })
    .then(res => res.json())
    .then(data => {
      addMessage("bot", data.response);
      saveCurrentChat(); // Save after every bot reply
    })
    .catch(err => {
      console.error("Error:", err);
      addMessage("bot", "⚠️ Sorry, something went wrong.");
    });
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

// Start new chat
function newChat() {
  currentChat = [];
  document.getElementById("chatBox").innerHTML =
    '<div class="message bot">Hello! I am your Hybrid Chatbot. How can I help you today?</div>';
}

// Show previous chats
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

// ===== Profile Logic =====
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

// ===== Auto-login Check =====
window.onload = function() {
  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("portalPage").style.display = "flex";
    openSection("chatSection");
    loadProfile();
    newChat();
  }
};
