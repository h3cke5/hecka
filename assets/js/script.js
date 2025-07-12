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

  generateIconGrid();

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

function generateCommandGroups() {
  const commandList = document.querySelector('.command-list');
const economy = `
  <div class="command-group active" data-group="economy">
    <h3 class="command-category-title"><i class="fas fa-coins"></i> Economy Commands</h3>
    <div class="command-category-list">
      <div class="command-item">
        <div class="command-name"><i class="fas fa-wallet"></i> bal</div>
        <div class="command-description">Check your current balance</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-calendar-day"></i> daily</div>
        <div class="command-description">Claim your daily reward</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-briefcase"></i> work</div>
        <div class="command-description">Work a job to earn some money</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hand-holding-usd"></i> pay</div>
        <div class="command-description">Send money to another user</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-exchange-alt"></i> transfer</div>
        <div class="command-description">Securely transfer money with confirmation</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-trophy"></i> leaderboard</div>
        <div class="command-description">View the richest users in the server</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-user-secret"></i> crime</div>
        <div class="command-description">Commit a crime and risk losing or gaining money</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-skull-crossbones"></i> rob</div>
        <div class="command-description">Attempt to rob another user</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-ticket-alt"></i> raspadinha</div>
        <div class="command-description">Buy a scratch card and test your luck</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-dice"></i> roulette</div>
        <div class="command-description">Play roulette and bet your coins</div>
      </div>
    </div>
  </div>`;
const moderation = `
  <div class="command-group" data-group="moderation">
    <h3 class="command-category-title"><i class="fas fa-gavel"></i> Moderation Commands</h3>
    <div class="command-category-list">
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hammer"></i> ban</div>
        <div class="command-description">Ban a user from the server.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-list"></i> banlist</div>
        <div class="command-description">Show a list of banned users.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-broom"></i> clear</div>
        <div class="command-description">Clear messages from a channel.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-user-slash"></i> kick</div>
        <div class="command-description">Kick a user from the server.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-lock"></i> lock</div>
        <div class="command-description">Lock a channel to prevent messages.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-unlock"></i> unlock</div>
        <div class="command-description">Unlock a previously locked channel.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-id-card-alt"></i> nick</div>
        <div class="command-description">Change a user's nickname.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hourglass-half"></i> slowmode</div>
        <div class="command-description">Set slowmode duration for a channel.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-robot"></i> set-botlist</div>
        <div class="command-description">Configure the channel for the bot list system.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-door-open"></i> set-welcome</div>
        <div class="command-description">Configure the welcome message and channel.</div>
      </div>
    </div>
  </div>`;
const entertainment = `
  <div class="command-group" data-group="entertainment">
    <h3 class="command-category-title"><i class="fas fa-list"></i> Entertainment Commands</h3>
    <div class="command-category-list">
      <div class="command-item">
        <div class="command-name"><i class="fas fa-circle-question"></i> 8ball</div>
        <div class="command-description">Ask the magic 8ball a question.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-heart"></i> compliment</div>
        <div class="command-description">Send someone a nice compliment.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hand-holding-heart"></i> cuddle</div>
        <div class="command-description">Send a cuddle to someone!</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-music"></i> dance</div>
        <div class="command-description">Show off some dance moves.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-utensils"></i> feed</div>
        <div class="command-description">Feed someone something tasty.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-rainbow"></i> gay</div>
        <div class="command-description">Check someone's gay percentage (funny).</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-user-secret"></i> hack</div>
        <div class="command-description">Fake hack a user (for fun).</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hands"></i> hug</div>
        <div class="command-description">Give someone a warm hug.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-kiss-wink-heart"></i> kiss</div>
        <div class="command-description">Send a kiss to someone!</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-hand-back-fist"></i> pat</div>
        <div class="command-description">Pat someone's head.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-fingerprint"></i> poke</div>
        <div class="command-description">Poke someone playfully.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-angry"></i> punch</div>
        <div class="command-description">Throw a playful punch.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-fire"></i> roast</div>
        <div class="command-description">Roast someone with humor.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fa-hand-back-fist"></i> slap</div>
        <div class="command-description">Give someone a slap!</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-feather"></i> tickle</div>
        <div class="command-description">Tickle someone!</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-question"></i> truth</div>
        <div class="command-description">Ask a truth question!</div>
      </div>
    </div>
  </div>`;
const utility = `
  <div class="command-group" data-group="utility">
    <h3 class="command-category-title"><i class="fas fa-tools"></i> Utility Commands</h3>
    <div class="command-category-list">
      <div class="command-item">
        <div class="command-name"><i class="fas fa-plus-circle"></i> addbot</div>
        <div class="command-description">Submit a bot to the bot list.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-moon"></i> afk</div>
        <div class="command-description">Set your AFK status.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-user-circle"></i> avatar</div>
        <div class="command-description">View your or someone else's avatar.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-image"></i> banner</div>
        <div class="command-description">See your or someone else's banner.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-info-circle"></i> botinfo</div>
        <div class="command-description">View detailed information about the bot.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-lightbulb"></i> botsuggest</div>
        <div class="command-description">Send a suggestion for the bot.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-calculator"></i> calc</div>
        <div class="command-description">Perform a simple calculation.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-cogs"></i> config</div>
        <div class="command-description">Edit bot configuration for your server.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-smile"></i> emojis</div>
        <div class="command-description">List or search server emojis.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-question-circle"></i> help</div>
        <div class="command-description">Display all available commands.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-id-card"></i> perfil</div>
        <div class="command-description">Show your user profile.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-id-badge"></i> userinfo</div>
        <div class="command-description">Get information about a user.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-server"></i> serverinfo</div>
        <div class="command-description">Show information about the current server.</div>
      </div>
      <div class="command-item">
        <div class="command-name"><i class="fas fa-cloud-sun"></i> weather</div>
        <div class="command-description">Check the weather in a specific location.</div>
      </div>
    </div>
  </div>`;
  commandList.innerHTML = economy + moderation + entertainment + utility;
}

function generateIconGrid() {
  const iconsContainer = document.querySelector('.icons-container');

  const icons = [
    { name: 'play', icon: 'fas fa-play' },
    { name: 'pause', icon: 'fas fa-pause' },
    { name: 'skip', icon: 'fas fa-forward' },
    { name: 'previous', icon: 'fas fa-backward' },
    { name: 'stop', icon: 'fas fa-stop' },
    { name: 'loop', icon: 'fas fa-redo' },
    { name: 'shuffle', icon: 'fas fa-random' },
    { name: 'volume', icon: 'fas fa-volume-up' },
    { name: 'mute', icon: 'fas fa-volume-mute' },
    { name: 'playlist', icon: 'fas fa-list' },
    { name: 'lyrics', icon: 'fas fa-file-alt' },
    { name: 'filter', icon: 'fas fa-sliders-h' },
    { name: 'spotify', icon: 'fab fa-spotify' },
    { name: 'youtube', icon: 'fab fa-youtube' },
    { name: 'soundcloud', icon: 'fab fa-soundcloud' },
    { name: 'deezer', icon: 'fas fa-music' },
    { name: 'apple', icon: 'fab fa-apple' },
    { name: 'radio', icon: 'fas fa-broadcast-tower' },
    { name: '24/7', icon: 'fas fa-clock' },
    { name: 'queue', icon: 'fas fa-stream' },
    { name: 'search', icon: 'fas fa-search' },
    { name: 'grab', icon: 'fas fa-download' },
    { name: 'vote', icon: 'fas fa-vote-yea' },
    { name: 'premium', icon: 'fas fa-crown' },
    { name: 'support', icon: 'fas fa-headset' },
    { name: 'invite', icon: 'fas fa-user-plus' },
    { name: 'help', icon: 'fas fa-question-circle' },
    { name: 'settings', icon: 'fas fa-cog' },
    { name: 'bassboost', icon: 'fas fa-volume-down' },
    { name: 'nightcore', icon: 'fas fa-moon' },
    { name: 'karaoke', icon: 'fas fa-microphone' },
    { name: 'vaporwave', icon: 'fas fa-water' },
    { name: 'equalizer', icon: 'fas fa-sliders-h' },
    { name: 'volume_up', icon: 'fas fa-volume-up' },
    { name: 'volume_down', icon: 'fas fa-volume-down' },
    { name: 'discord', icon: 'fab fa-discord' },
    { name: 'heart', icon: 'fas fa-heart' },
    { name: 'star', icon: 'fas fa-star' },
    { name: 'fire', icon: 'fas fa-fire' },
    { name: 'bolt', icon: 'fas fa-bolt' },
  ];

  let iconsHTML = '';
  icons.forEach(icon => {
    iconsHTML += `
      <div class="icon-item" data-name="${icon.name}" title="${icon.name}">
        <span><i class="${icon.icon}"></i></span>
      </div>
    `;
  });

  iconsContainer.innerHTML = iconsHTML;

  const iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach(item => {
    const randomDelay = Math.random() * 2;
    item.style.animationDelay = `${randomDelay}s`;

    item.addEventListener('mouseenter', () => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      item.appendChild(ripple);

      item.classList.add('glow');

      setTimeout(() => {
        ripple.remove();
        item.classList.remove('glow');
      }, 1000);
    });
  });
}

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

function handleSpotifyAuth() {
  const callbackElement = document.getElementById('spotify-callback');

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    callbackElement.innerHTML = `<p>Authentication successful You can close this window.</p>`;
    callbackElement.style.display = 'block';

    setTimeout(() => {
      callbackElement.style.display = 'none';
    }, 5000);
  }
}
