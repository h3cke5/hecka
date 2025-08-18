const DISCORD_LOGIN_URL = "https://discord.com/oauth2/authorize?client_id=1014461610087174164&redirect_uri=https%3A%2F%2Fhecka.pt%2Fbotlist%2Fcallback.html&response_type=token&scope=identify";

const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userInfo = document.getElementById("userInfo");
const userMenu = document.getElementById("userMenu");

loginBtn.href = DISCORD_LOGIN_URL;

let token = localStorage.getItem("discord_token");

// Função para exibir usuário logado
function setUserLogged(user) {
  loginBtn.style.display = "none";
  userName.textContent = user.username;
  userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
  userAvatar.style.display = "block";
}

// Se tiver token, busca dados do usuário
if (token) {
  fetch("https://discord.com/api/users/@me", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => setUserLogged(user))
  .catch(() => {
    localStorage.removeItem("discord_token");
    loginBtn.style.display = "inline-block";
    token = null;
  });
}

// Toggle menu do usuário
userInfo.addEventListener("click", () => {
  if (!token) return;
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("discord_token");
  window.location.reload();
});

// Lista de bots
let bots = JSON.parse(localStorage.getItem("bots")) || [
  { name: "Hey, Heckaツ!", avatar: "https://cdn.discordapp.com/embed/avatars/0.png", desc: "Pior bot", status: "Aprovado", date: "18/08/2025" }
];

function renderBots() {
  const container = document.getElementById("botlist");
  container.innerHTML = "";
  bots.forEach(bot => {
    container.innerHTML += `
      <div class="bot-card">
        <img src="${bot.avatar}" class="bot-avatar">
        <div class="bot-info">
          <h3>${bot.name}</h3>
          <p>Status: ${bot.status}</p>
          <p>Enviado em: ${bot.date}</p>
          <p>${bot.desc}</p>
        </div>
      </div>
    `;
  });
}

renderBots();

// Modal adicionar bot
const modal = document.getElementById("botModal");
const openModal = document.getElementById("addBotBtn");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", () => {
  if (!token) {
    alert("⚠️ Você precisa estar logado para adicionar um bot!");
    return;
  }
  modal.style.display = "flex";
});

closeModal.addEventListener("click", () => modal.style.display = "none");

// Fechar modal clicando fora
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// Submeter form
document.getElementById("botForm").addEventListener("submit", e => {
  e.preventDefault();

  const bot = {
    id: document.getElementById("botId").value,
    prefix: document.getElementById("botPrefix").value,
    desc: document.getElementById("botDesc").value,
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
    status: "Aprovado",
    date: new Date().toLocaleDateString("pt-BR")
  };

  bots.push(bot);
  localStorage.setItem("bots", JSON.stringify(bots));
  renderBots();
  modal.style.display = "none";
  document.getElementById("botForm").reset();
});
