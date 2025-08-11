document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileMenuToggle.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    const icon = mobileMenuToggle.querySelector('i');
    if (navContainer.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navContainer.classList.contains('active')) {
        navContainer.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (
      navContainer.classList.contains('active') &&
      !navContainer.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      navContainer.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  const categories = document.querySelectorAll('.category');
  let autoSwitchInterval;
  let userInteracted = false;
  let currentCategoryIndex = 0;

  function switchToCategory(categoryIndex) {
    const category = categories[categoryIndex];

    if (category.classList.contains('active')) {
      return;
    }

    categories.forEach(c => c.classList.remove('active'));
    category.classList.add('active');

    const activeGroup = document.querySelector('.command-group.active');
    const groupToShow = document.querySelector(`[data-group="${category.dataset.category}"]`);

    if (activeGroup) {
      const items = activeGroup.querySelectorAll('.command-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(-20px)';
        }, 30 * index);
      });

      setTimeout(() => {
        document.querySelectorAll('.command-group').forEach(g => {
          g.classList.remove('active');
        });

        if (groupToShow) {
          groupToShow.classList.add('active');

          const commandItems = groupToShow.querySelectorAll('.command-item');
          commandItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50 * index); 
          });
        }
      }, 300);
    } else {
      document.querySelectorAll('.command-group').forEach(g => {
        g.classList.remove('active');
      });

      if (groupToShow) {
        groupToShow.classList.add('active');

        const commandItems = groupToShow.querySelectorAll('.command-item');
        commandItems.forEach((item, index) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';

          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50 * index); 
        });
      }
    }
  }

  const progressBar = document.querySelector('.category-progress');
  const switchInterval = 5000;
  let startTime;

  function animateProgress(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / switchInterval * 100, 100);

    progressBar.style.width = `${progress}%`;

    if (progress < 100 && !userInteracted) {
      requestAnimationFrame(animateProgress);
    } else if (progress >= 100 && !userInteracted) {
      startTime = null;
      progressBar.style.width = '0%';

      currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
      switchToCategory(currentCategoryIndex);

      requestAnimationFrame(animateProgress);
    } else if (userInteracted) {
      progressBar.style.width = '0%';
    }
  }

  function startAutoSwitch() {
    if (autoSwitchInterval) {
      clearInterval(autoSwitchInterval);
    }

    startTime = null;
    requestAnimationFrame(animateProgress);

    autoSwitchInterval = setInterval(() => {
      if (!userInteracted) {
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
        switchToCategory(currentCategoryIndex);

        progressBar.style.width = '0%';
        startTime = null;
      }
    }, switchInterval);
  }

  categories.forEach((category, index) => {
    category.addEventListener('click', () => {
      userInteracted = true;
      currentCategoryIndex = index;

      progressBar.style.width = '0%';

      switchToCategory(index);

      setTimeout(() => {
        userInteracted = false;
        requestAnimationFrame(function(timestamp) {
          startTime = timestamp;
          animateProgress(timestamp);
        });
      }, 10000);
    });
  });

  const commandsSection = document.querySelector('.commands');
  commandsSection.addEventListener('mousemove', () => {
    userInteracted = true;

    progressBar.style.width = '0%';

    clearTimeout(commandsSection.mouseMoveTimeout);
    commandsSection.mouseMoveTimeout = setTimeout(() => {
      userInteracted = false;
      requestAnimationFrame(function(timestamp) {
        startTime = timestamp;
        animateProgress(timestamp);
      });
    }, 10000);
  });

  generateCommandGroups();

  initAnimations();

  setTimeout(() => {
    const activeGroup = document.querySelector('.command-group.active');
    if (activeGroup) {
      const commandItems = activeGroup.querySelectorAll('.command-item');
      commandItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';

        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50 * index);
      });
    }

    startAutoSwitch();
  }, 500);
});

const translations = {
en: {
  economyTitle: "Economy Commands",
  economyCommands: [
    { name: "bal", icon: "fas fa-wallet", desc: "View your current balance" },
    { name: "blackjack", icon: "fas fa-gamepad", desc: "Play blackjack and bet your money" },
    { name: "coinflip", icon: "fas fa-coins", desc: "Play coinflip and bet your balance" },
    { name: "crime", icon: "fas fa-user-secret", desc: "Commit a crime and risk losing or earning money" },
    { name: "daily", icon: "fas fa-calendar-day", desc: "Claim your daily reward" },
    { name: "pay", icon: "fas fa-hand-holding-usd", desc: "Send money to another user" },
    { name: "rank", icon: "fas fa-chart-line", desc: "Check your economy ranking" },
    { name: "raspadinha", icon: "fas fa-ticket-alt", desc: "Buy a scratch ticket and test your luck" },
    { name: "rob", icon: "fas fa-skull-crossbones", desc: "Try to rob another user" },
    { name: "roulette", icon: "fas fa-dice", desc: "Play roulette and bet your coins" },
    { name: "transfers", icon: "fas fa-exchange-alt", desc: "Transfer money with security confirmation" },
    { name: "work", icon: "fas fa-briefcase", desc: "Work to earn money" },
    { name: "leaderboard", icon: "fas fa-trophy", desc: "See the richest users" }],
  moderationTitle: "Moderation Commands",
  moderationCommands: [
    { name: "ban", icon: "fas fa-hammer", desc: "Ban a user from the server" },
    { name: "banlist", icon: "fas fa-list", desc: "Show a list of banned users" },
    { name: "clear", icon: "fas fa-broom", desc: "Clear messages from a channel" },
    { name: "config", icon: "fas fa-cogs", desc: "Configure moderation settings" },
    { name: "kick", icon: "fas fa-user-slash", desc: "Kick a user from the server" },
    { name: "lock", icon: "fas fa-lock", desc: "Lock a channel to prevent messages" },
    { name: "nick", icon: "fas fa-id-card-alt", desc: "Change a user's nickname" },
    { name: "set-badwords", icon: "fas fa-shield-alt", desc: "Configure filtered bad words" },
    { name: "set-captcha", icon: "fas fa-shield-virus", desc: "Enable and configure captcha verification" },
    { name: "set-welcome", icon: "fas fa-door-open", desc: "Configure the welcome message and channel" },
    { name: "slowmode", icon: "fas fa-hourglass-half", desc: "Set slowmode duration for a channel" },
    { name: "unlock", icon: "fas fa-unlock", desc: "Unlock a previously locked channel" }],
  entertainmentTitle: "Entertainment Commands",
  entertainmentCommands: [
    { name: "8ball", icon: "fas fa-circle-question", desc: "Ask the magic 8ball a question" },
    { name: "compliment", icon: "fas fa-heart", desc: "Send someone a nice compliment" },
    { name: "cuddle", icon: "fas fa-hand-holding-heart", desc: "Send a cuddle to someone" },
    { name: "dance", icon: "fas fa-music", desc: "Show off some dance moves" },
    { name: "feed", icon: "fas fa-utensils", desc: "Feed someone something tasty" },
    { name: "gay", icon: "fas fa-rainbow", desc: "Check someone's gay percentage (funny)" },
    { name: "hack", icon: "fas fa-user-secret", desc: "Fake hack a user (for fun)" },
    { name: "hug", icon: "fas fa-hands-helping", desc: "Give someone a warm hug" },
    { name: "kiss", icon: "fas fa-kiss-wink-heart", desc: "Send a kiss to someone" },
    { name: "pat", icon: "fas fa-hand-paper", desc: "Pat someone's head" },
    { name: "poke", icon: "fas fa-fingerprint", desc: "Poke someone playfully" },
    { name: "punch", icon: "fas fa-angry", desc: "Throw a playful punch" },
    { name: "roast", icon: "fas fa-fire", desc: "Roast someone with humor" },
    { name: "ship", icon: "fas fa-heart-broken", desc: "Ship two users together" },
    { name: "slap", icon: "fas fa-hand-rock", desc: "Give someone a slap" },
    { name: "tickle", icon: "fas fa-feather", desc: "Tickle someone" },
    { name: "truth", icon: "fas fa-question", desc: "Ask a truth question" }],
  utilityTitle: "Utility Commands",
  utilityCommands: [
    { name: "afk", icon: "fas fa-moon", desc: "Set your AFK status" },
    { name: "avatar", icon: "fas fa-user-circle", desc: "View your or someone else's avatar" },
    { name: "banner", icon: "fas fa-image", desc: "See your or someone else's banner" },
    { name: "botinfo", icon: "fas fa-info-circle", desc: "View detailed information about the bot" },
    { name: "botsuggest", icon: "fas fa-lightbulb", desc: "Send a suggestion for the bot" },
    { name: "calc", icon: "fas fa-calculator", desc: "Perform a simple calculation" },
    { name: "channelinfo", icon: "fas fa-hashtag", desc: "Show information about a channel" },
    { name: "emojis", icon: "fas fa-smile", desc: "List or search server emojis" },
    { name: "help", icon: "fas fa-question-circle", desc: "Display all available commands" },
    { name: "ia", icon: "fas fa-robot", desc: "Ask something to the bot AI" },
    { name: "perfil", icon: "fas fa-id-card", desc: "Show your user profile" },
    { name: "ping", icon: "fas fa-stopwatch", desc: "Check the bot's latency" },
    { name: "serverinfo", icon: "fas fa-server", desc: "Show information about the current server" },
    { name: "userinfo", icon: "fas fa-id-badge", desc: "Get information about a user" },
    { name: "weather", icon: "fas fa-cloud-sun", desc: "Check the weather in a specific location" }]
},
pt: {
  economyTitle: "Comandos de Economia",
  economyCommands: [
    { name: "bal", icon: "fas fa-wallet", desc: "Veja seu saldo atual" },
    { name: "blackjack", icon: "fas fa-gamepad", desc: "Jogue blackjack e aposte seu dinheiro" },
    { name: "coinflip", icon: "fas fa-coins", desc: "Jogue cara ou coroa e aposte seu saldo" },
    { name: "crime", icon: "fas fa-user-secret", desc: "Cometa um crime e arrisque perder ou ganhar dinheiro" },
    { name: "daily", icon: "fas fa-calendar-day", desc: "Resgate sua recompensa diária" },
    { name: "pay", icon: "fas fa-hand-holding-usd", desc: "Envie dinheiro para outro usuário" },
    { name: "rank", icon: "fas fa-chart-line", desc: "Confira seu ranking na economia" },
    { name: "raspadinha", icon: "fas fa-ticket-alt", desc: "Compre um bilhete raspadinha e teste sua sorte" },
    { name: "rob", icon: "fas fa-skull-crossbones", desc: "Tente roubar outro usuário" },
    { name: "roulette", icon: "fas fa-dice", desc: "Jogue roleta e aposte suas moedas" },
    { name: "transfers", icon: "fas fa-exchange-alt", desc: "Transfira dinheiro com confirmação de segurança" },
    { name: "work", icon: "fas fa-briefcase", desc: "Trabalhe para ganhar dinheiro" },
    { name: "leaderboard", icon: "fas fa-trophy", desc: "Veja os usuários mais ricos" }],
  moderationTitle: "Comandos de Moderação",
  moderationCommands: [
    { name: "ban", icon: "fas fa-hammer", desc: "Banir um usuário do servidor" },
    { name: "banlist", icon: "fas fa-list", desc: "Mostrar lista de usuários banidos" },
    { name: "clear", icon: "fas fa-broom", desc: "Limpar mensagens de um canal" },
    { name: "config", icon: "fas fa-cogs", desc: "Configurar as definições de moderação" },
    { name: "kick", icon: "fas fa-user-slash", desc: "Expulsar um usuário do servidor" },
    { name: "lock", icon: "fas fa-lock", desc: "Trancar um canal para impedir mensagens" },
    { name: "nick", icon: "fas fa-id-card-alt", desc: "Alterar o apelido de um usuário" },
    { name: "set-badwords", icon: "fas fa-shield-alt", desc: "Configurar palavras proibidas filtradas" },
    { name: "set-captcha", icon: "fas fa-shield-virus", desc: "Ativar e configurar verificação por captcha" },
    { name: "set-welcome", icon: "fas fa-door-open", desc: "Configurar a mensagem e canal de boas-vindas" },
    { name: "slowmode", icon: "fas fa-hourglass-half", desc: "Definir duração do modo lento para um canal" },
    { name: "unlock", icon: "fas fa-unlock", desc: "Destrancar um canal previamente trancado" }],
  entertainmentTitle: "Comandos de Entretenimento",
  entertainmentCommands: [
    { name: "8ball", icon: "fas fa-circle-question", desc: "Pergunte algo à bola mágica 8" },
    { name: "compliment", icon: "fas fa-heart", desc: "Envie um elogio para alguém" },
    { name: "cuddle", icon: "fas fa-hand-holding-heart", desc: "Envie um abraço aconchegante para alguém" },
    { name: "dance", icon: "fas fa-music", desc: "Mostre alguns passos de dança" },
    { name: "feed", icon: "fas fa-utensils", desc: "Alimente alguém com algo saboroso" },
    { name: "gay", icon: "fas fa-rainbow", desc: "Verifique a porcentagem gay de alguém (diversão)" },
    { name: "hack", icon: "fas fa-user-secret", desc: "Fingir hackear um usuário (brincadeira)" },
    { name: "hug", icon: "fas fa-hands-helping", desc: "Dê um abraço caloroso em alguém" },
    { name: "kiss", icon: "fas fa-kiss-wink-heart", desc: "Envie um beijo para alguém" },
    { name: "pat", icon: "fas fa-hand-paper", desc: "Acaricie a cabeça de alguém" },
    { name: "poke", icon: "fas fa-fingerprint", desc: "Cutucar alguém de forma divertida" },
    { name: "punch", icon: "fas fa-angry", desc: "Dar um soco de brincadeira" },
    { name: "roast", icon: "fas fa-fire", desc: "Zoe alguém com humor" },
    { name: "ship", icon: "fas fa-heart-broken", desc: "Juntar dois usuários em um casal fictício" },
    { name: "slap", icon: "fas fa-hand-rock", desc: "Dar um tapa em alguém" },
    { name: "tickle", icon: "fas fa-feather", desc: "Fazer cócegas em alguém" },
    { name: "truth", icon: "fas fa-question", desc: "Fazer uma pergunta de verdade" }],
  utilityTitle: "Comandos de Utilidade",
  utilityCommands: [
    { name: "afk", icon: "fas fa-moon", desc: "Defina seu status de ausente (AFK)" },
    { name: "avatar", icon: "fas fa-user-circle", desc: "Veja seu avatar ou o de outra pessoa" },
    { name: "banner", icon: "fas fa-image", desc: "Veja seu banner ou o de outra pessoa" },
    { name: "botinfo", icon: "fas fa-info-circle", desc: "Veja informações detalhadas sobre o bot" },
    { name: "botsuggest", icon: "fas fa-lightbulb", desc: "Envie uma sugestão para o bot" },
    { name: "calc", icon: "fas fa-calculator", desc: "Faça um cálculo simples" },
    { name: "channelinfo", icon: "fas fa-hashtag", desc: "Mostre informações sobre um canal" },
    { name: "emojis", icon: "fas fa-smile", desc: "Liste ou pesquise emojis do servidor" },
    { name: "help", icon: "fas fa-question-circle", desc: "Mostre todos os comandos disponíveis" },
    { name: "ia", icon: "fas fa-robot", desc: "Pergunte algo à IA do bot" },
    { name: "perfil", icon: "fas fa-id-card", desc: "Mostre seu perfil de usuário" },
    { name: "ping", icon: "fas fa-stopwatch", desc: "Verifique a latência do bot" },
    { name: "serverinfo", icon: "fas fa-server", desc: "Mostre informações sobre o servidor atual" },
    { name: "userinfo", icon: "fas fa-id-badge", desc: "Obtenha informações sobre um usuário" },
    { name: "weather", icon: "fas fa-cloud-sun", desc: "Confira o clima em uma localização específica" }]
},
es: {
  economyTitle: "Comandos de Economía",
  economyCommands: [
    { name: "bal", icon: "fas fa-wallet", desc: "Consulta tu saldo actual" },
    { name: "blackjack", icon: "fas fa-gamepad", desc: "Juega blackjack y apuesta tu dinero" },
    { name: "coinflip", icon: "fas fa-coins", desc: "Juega cara o cruz y apuesta tu saldo" },
    { name: "crime", icon: "fas fa-user-secret", desc: "Comete un crimen y arriesga perder o ganar dinero" },
    { name: "daily", icon: "fas fa-calendar-day", desc: "Reclama tu recompensa diaria" },
    { name: "pay", icon: "fas fa-hand-holding-usd", desc: "Envía dinero a otro usuario" },
    { name: "rank", icon: "fas fa-chart-line", desc: "Consulta tu clasificación en la economía" },
    { name: "raspadinha", icon: "fas fa-ticket-alt", desc: "Compra un boleto de rasca y gana y prueba tu suerte" },
    { name: "rob", icon: "fas fa-skull-crossbones", desc: "Intenta robar a otro usuario" },
    { name: "roulette", icon: "fas fa-dice", desc: "Juega a la ruleta y apuesta tus monedas" },
    { name: "transfers", icon: "fas fa-exchange-alt", desc: "Transfiere dinero con confirmación de seguridad" },
    { name: "work", icon: "fas fa-briefcase", desc: "Trabaja para ganar dinero" },
    { name: "leaderboard", icon: "fas fa-trophy", desc: "Consulta los usuarios más ricos" }],
  moderationTitle: "Comandos de Moderación",
  moderationCommands: [
    { name: "ban", icon: "fas fa-hammer", desc: "Prohibir a un usuario del servidor" },
    { name: "banlist", icon: "fas fa-list", desc: "Mostrar una lista de usuarios prohibidos" },
    { name: "clear", icon: "fas fa-broom", desc: "Eliminar mensajes de un canal" },
    { name: "config", icon: "fas fa-cogs", desc: "Configurar ajustes de moderación" },
    { name: "kick", icon: "fas fa-user-slash", desc: "Expulsar a un usuario del servidor" },
    { name: "lock", icon: "fas fa-lock", desc: "Bloquear un canal para evitar mensajes" },
    { name: "nick", icon: "fas fa-id-card-alt", desc: "Cambiar el apodo de un usuario" },
    { name: "set-badwords", icon: "fas fa-shield-alt", desc: "Configurar palabras prohibidas filtradas" },
    { name: "set-captcha", icon: "fas fa-shield-virus", desc: "Habilitar y configurar verificación captcha" },
    { name: "set-welcome", icon: "fas fa-door-open", desc: "Configurar el mensaje y canal de bienvenida" },
    { name: "slowmode", icon: "fas fa-hourglass-half", desc: "Configurar duración del modo lento en un canal" },
    { name: "unlock", icon: "fas fa-unlock", desc: "Desbloquear un canal previamente bloqueado" }],
  entertainmentTitle: "Comandos de Entretenimiento",
  entertainmentCommands: [
    { name: "8ball", icon: "fas fa-circle-question", desc: "Hazle una pregunta a la bola 8 mágica" },
    { name: "compliment", icon: "fas fa-heart", desc: "Envía un cumplido agradable a alguien" },
    { name: "cuddle", icon: "fas fa-hand-holding-heart", desc: "Envía un abrazo cariñoso a alguien" },
    { name: "dance", icon: "fas fa-music", desc: "Muestra algunos pasos de baile" },
    { name: "feed", icon: "fas fa-utensils", desc: "Alimenta a alguien con algo delicioso" },
    { name: "gay", icon: "fas fa-rainbow", desc: "Consulta el porcentaje gay de alguien (divertido)" },
    { name: "hack", icon: "fas fa-user-secret", desc: "Hackea falsamente a un usuario (por diversión)" },
    { name: "hug", icon: "fas fa-hands-helping", desc: "Da un abrazo cálido a alguien" },
    { name: "kiss", icon: "fas fa-kiss-wink-heart", desc: "Envía un beso a alguien" },
    { name: "pat", icon: "fas fa-hand-paper", desc: "Da una palmada en la cabeza a alguien" },
    { name: "poke", icon: "fas fa-fingerprint", desc: "Toca a alguien de forma juguetona" },
    { name: "punch", icon: "fas fa-angry", desc: "Da un golpe juguetón" },
    { name: "roast", icon: "fas fa-fire", desc: "Haz una broma para molestar a alguien" },
    { name: "ship", icon: "fas fa-heart-broken", desc: "Relaciona a dos usuarios" },
    { name: "slap", icon: "fas fa-hand-rock", desc: "Da una bofetada a alguien" },
    { name: "tickle", icon: "fas fa-feather", desc: "Haz cosquillas a alguien" },
    { name: "truth", icon: "fas fa-question", desc: "Haz una pregunta de verdad" }],
  utilityTitle: "Comandos de Utilidad",
  utilityCommands: [
    { name: "afk", icon: "fas fa-moon", desc: "Establece tu estado AFK" },
    { name: "avatar", icon: "fas fa-user-circle", desc: "Ver tu avatar o el de otra persona" },
    { name: "banner", icon: "fas fa-image", desc: "Ver tu banner o el de otra persona" },
    { name: "botinfo", icon: "fas fa-info-circle", desc: "Ver información detallada del bot" },
    { name: "botsuggest", icon: "fas fa-lightbulb", desc: "Enviar una sugerencia para el bot" },
    { name: "calc", icon: "fas fa-calculator", desc: "Realizar un cálculo simple" },
    { name: "channelinfo", icon: "fas fa-hashtag", desc: "Mostrar información sobre un canal" },
    { name: "emojis", icon: "fas fa-smile", desc: "Listar o buscar emojis del servidor" },
    { name: "help", icon: "fas fa-question-circle", desc: "Mostrar todos los comandos disponibles" },
    { name: "ia", icon: "fas fa-robot", desc: "Preguntar algo a la IA del bot" },
    { name: "perfil", icon: "fas fa-id-card", desc: "Mostrar tu perfil de usuario" },
    { name: "ping", icon: "fas fa-stopwatch", desc: "Verificar la latencia del bot" },
    { name: "serverinfo", icon: "fas fa-server", desc: "Mostrar información del servidor actual" },
    { name: "userinfo", icon: "fas fa-id-badge", desc: "Obtener información sobre un usuario" },
    { name: "weather", icon: "fas fa-cloud-sun", desc: "Consultar el clima en una ubicación específica" }]
}};

function generateCommandGroups(lang) {
  const commandList = document.querySelector(".command-list");
  const t = translations[lang] || translations.en;

  function createGroupHTML(title, commands, groupName, active = false) {
    return `
      <div class="command-group ${active ? "active" : ""}" data-group="${groupName}">
        <h3 class="command-category-title"><i class="fas fa-${groupName === "economy" ? "coins" : groupName === "moderation" ? "gavel" : groupName === "entertainment" ? "gamepad" : "tools"}"></i> ${title}</h3>
        <div class="command-category-list">
          ${commands
            .map(
              (cmd) => `
            <div class="command-item">
              <div class="command-name"><i class="${cmd.icon}"></i> ${cmd.name}</div>
              <div class="command-description">${cmd.desc}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  commandList.innerHTML =
    createGroupHTML(t.economyTitle, t.economyCommands, "economy", true) +
    createGroupHTML(t.moderationTitle, t.moderationCommands, "moderation") +
    createGroupHTML(t.entertainmentTitle, t.entertainmentCommands, "entertainment") +
    createGroupHTML(t.utilityTitle, t.utilityCommands, "utility");

  // Troca de categorias
  const categories = document.querySelectorAll(".category");
  const groups = document.querySelectorAll(".command-group");

  categories.forEach((category) => {
    category.addEventListener("click", () => {
      const target = category.dataset.category;
      categories.forEach((c) => c.classList.remove("active"));
      category.classList.add("active");
      groups.forEach((g) => {
        g.classList.toggle("active", g.dataset.group === target);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userLang = navigator.language.slice(0, 2);
  const supportedLangs = ["en", "pt", "es"];
  const lang = supportedLangs.includes(userLang) ? userLang : "en";
  generateCommandGroups(lang);
});

function initAnimations() {
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .support-card');

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;

      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add('animate');
      }
    });
  };

  animateOnScroll();

  window.addEventListener('scroll', animateOnScroll);
}
