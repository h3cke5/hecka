const DISCORD_LOGIN_URL = "https://discord.com/oauth2/authorize?client_id=1014461610087174164&redirect_uri=https%3A%2F%2Fhecka.pt%2Fbotlist%2Fcallback.html&response_type=token&scope=identify";

const loginBtn = document.getElementById("loginBtn");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userMenu = document.getElementById("userMenu");

loginBtn.href = DISCORD_LOGIN_URL;

const token = localStorage.getItem("discord_token");
if (token) {
  fetch("https://discord.com/api/users/@me", {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(user => {
    loginBtn.style.display = "none";
    userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userAvatar.style.display = "block";
    userName.textContent = user.username;
  })
  .catch(() => {
    localStorage.removeItem("discord_token");
    loginBtn.style.display = "inline-block";
  });
}

userAvatar.addEventListener("click", () => {
  userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("discord_token");
  window.location.href = "index.html";
});

let bots = JSON.parse(localStorage.getItem("bots")) || [
  { name: "Hey, Heckaツ!", avatar: "https://cdn.discordapp.com/embed/avatars/0.png", desc: "Pior bot", invite: "#", status: "Aprovado", date: "18/08/2025" }
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
        </div>
      </div>
    `;
  });
}
renderBots();

const modal = document.getElementById("botModal");
const openModal = document.getElementById("addBotBtn");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", () => {
  if (!localStorage.getItem("discord_token")) {
    alert("⚠️ Você precisa estar logado para adicionar um bot!");
    window.location.href = DISCORD_LOGIN_URL;
  } else {
    modal.style.display = "flex";
  }
});
closeModal.addEventListener("click", () => modal.style.display = "none");

async function fetchBotInfo(botId) {
  try {
    const res = await fetch(`https://discord.com/api/v10/users/${botId}`, {
      headers: { "Authorization": `Bot MTAxNDQ2MTYxMDA4NzE3NDE2NA.G5pMps.nnmFzbTTmgIr0TIq1X-dDCHkqbzQlTWl8gzQUQ` }
    });

    if (!res.ok) throw new Error("Erro ao buscar o bot");

    const data = await res.json();
    document.getElementById("botAvatar").value = data.avatar 
      ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
  } catch (err) {
    console.error("Erro:", err);
    alert("⚠️ Não foi possível buscar o bot. Verifique o ID e se o token está correto.");
  }
}

document.getElementById("botId").addEventListener("blur", e => {
  const botId = e.target.value.trim();
  if (botId) fetchBotInfo(botId);
});

document.getElementById("botForm").addEventListener("submit", e => {
  e.preventDefault();

  const bot = {
    id: document.getElementById("botId").value,
    prefix: document.getElementById("botPrefix").value,
    desc: document.getElementById("botDesc").value,
    status: "Aprovado",
    date: new Date().toLocaleDateString("pt-BR")
  };

  bots.push(bot);
  localStorage.setItem("bots", JSON.stringify(bots));
  renderBots();
  modal.style.display = "none";

  document.getElementById("botForm").reset();
});
