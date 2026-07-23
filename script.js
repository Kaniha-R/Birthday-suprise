/* =========================================================
   HAPPY BIRTHDAY DIVASINI — script.js
   All interactivity: hero animation, ambient effects, gallery,
   timeline, games, confetti/fireworks, music, theme toggle.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------- small utilities ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const choice = (arr) => arr[randInt(0, arr.length - 1)];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     PROGRESS TRACKING (6 games unlock the finale)
     ========================================================= */
  const GAMES = ['balloons', 'quiz', 'catch', 'memory', 'candle', 'wheel'];
  const completed = new Set();

  function markComplete(key) {
    if (completed.has(key)) return;
    completed.add(key);
    updateProgressUI();
    burstConfetti(60);
  }

  function updateProgressUI() {
    const n = completed.size;
    $('#progressCount').textContent = n;
    $('#gateCount').textContent = n;
    const pct = Math.round((n / GAMES.length) * 100);
    $('#gateFill').style.width = pct + '%';
    const unlockBtn = $('#unlockBtn');
    if (n >= GAMES.length) {
      unlockBtn.disabled = false;
      unlockBtn.innerHTML = '<span>Open the Final Surprise</span><span class="start-btn-icon">🎆</span>';
    } else {
      unlockBtn.disabled = true;
      unlockBtn.textContent = `🔒 Locked — ${GAMES.length - n} more to go!`;
    }
  }

  /* =========================================================
     LOADER
     ========================================================= */
  window.addEventListener('load', () => {
    let p = 0;
    const fill = $('#loaderFill');
    const iv = setInterval(() => {
      p += randInt(8, 18);
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => {
          $('#loader').classList.add('hidden');
          startHeroSequence();
        }, 300);
      }
      fill.style.width = p + '%';
    }, 140);
  });

  /* =========================================================
     HERO — typing animation
     ========================================================= */
  function startHeroSequence() {
    typeText($('#typedTitle'), 'Happy Birthday Divasini ❤️', 65);
    spawnHeroBalloons();
    initConstellation();
  }

  function typeText(el, text, speed) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    cursor.textContent = '|';
    function step() {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      if (i <= text.length) {
        setTimeout(step, speed);
      } else {
        setTimeout(() => cursor.remove(), 1200);
      }
    }
    step();
  }

  function spawnHeroBalloons() {
    const field = $('#heroBalloons');
    const emojis = ['🎈', '🎈', '🎈', '🎈'];
    const colors = ['', 'filter-lav', 'filter-gold', ''];
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('span');
      b.className = 'hero-balloon';
      b.textContent = choice(emojis);
      b.style.left = rand(2, 92) + '%';
      b.style.animationDuration = rand(9, 16) + 's';
      b.style.animationDelay = rand(0, 8) + 's';
      b.style.fontSize = rand(1.6, 2.8) + 'rem';
      field.appendChild(b);
    }
  }

  /* Signature element: constellation canvas linking twinkling stars
     into a heart-ish shape, ambient behind the hero */
  function initConstellation() {
    const canvas = $('#constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, points = [];

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      points = [];
      const count = w < 700 ? 26 : 46;
      for (let i = 0; i < count; i++) {
        points.push({
          x: rand(0, w), y: rand(0, h),
          r: rand(1, 2.4),
          tw: rand(0, Math.PI * 2),
          speed: rand(0.02, 0.05)
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!w || !h) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      // connecting lines between close points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(255,215,170,${0.14 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      points.forEach(p => {
        p.tw += p.speed;
        const alpha = 0.4 + Math.sin(p.tw) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,240,220,${Math.max(0.1, alpha)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }
    draw();
  }

  /* =========================================================
     AMBIENT: floating hearts + sparkles across whole page
     ========================================================= */
  function ambientLoop() {
    if (prefersReducedMotion) return;
    const heartsLayer = $('#ambientHearts');
    const sparkleLayer = $('#ambientSparkles');

    setInterval(() => {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = choice(['❤️', '💗', '💕', '✨']);
      h.style.left = rand(0, 100) + '%';
      h.style.setProperty('--drift', rand(-60, 60) + 'px');
      h.style.animationDuration = rand(7, 13) + 's';
      heartsLayer.appendChild(h);
      setTimeout(() => h.remove(), 14000);
    }, 900);

    for (let i = 0; i < 40; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.animationDuration = rand(2, 5) + 's';
      s.style.animationDelay = rand(0, 4) + 's';
      sparkleLayer.appendChild(s);
    }
  }
  ambientLoop();

  /* cursor heart trail */
  if (!prefersReducedMotion && !('ontouchstart' in window)) {
    let lastTrail = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrail < 90) return;
      lastTrail = now;
      const t = document.createElement('span');
      t.className = 'trail-heart';
      t.textContent = '💗';
      t.style.left = e.clientX + 'px';
      t.style.top = e.clientY + 'px';
      $('#cursorTrail').appendChild(t);
      setTimeout(() => t.remove(), 900);
    });
  }

  /* =========================================================
     THEME TOGGLE
     ========================================================= */
  const themeBtn = $('#themeToggle');
  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
  });

  /* =========================================================
     AUDIO — tiny synth engine (no external files needed)
     ========================================================= */
  let audioCtx = null;
  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playChime() {
    const ctx = getCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const t = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  function playPop() {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  // "Happy Birthday" melody, looped softly as background music
  const MELODY = [
    [0, 261.6, 0.35], [0.4, 261.6, 0.2], [0.65, 293.7, 0.5], [1.2, 261.6, 0.5],
    [1.75, 349.2, 0.5], [2.3, 329.6, 0.9],
    [3.3, 261.6, 0.35], [3.7, 261.6, 0.2], [3.95, 293.7, 0.5], [4.5, 261.6, 0.5],
    [5.05, 392.0, 0.5], [5.6, 349.2, 0.9]
  ];
  const MELODY_LEN = 6.8;
  let musicOn = false;
  let musicTimer = null;

  function scheduleMelodyLoop() {
    if (!musicOn) return;
    const ctx = getCtx();
    const startAt = ctx.currentTime + 0.05;
    MELODY.forEach(([offset, freq, dur]) => {
      const t = startAt + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
    musicTimer = setTimeout(scheduleMelodyLoop, MELODY_LEN * 1000);
  }

  function setMusic(on) {
    musicOn = on;
    $('#musicToggle').textContent = on ? '🔊' : '🔈';
    if (on) {
      scheduleMelodyLoop();
    } else if (musicTimer) {
      clearTimeout(musicTimer);
    }
  }
  $('#musicToggle').addEventListener('click', () => setMusic(!musicOn));

  /* =========================================================
     CONFETTI (canvas, full screen burst)
     ========================================================= */
  const confettiCanvas = $('#confettiCanvas');
  const cctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiRunning = false;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  const CONFETTI_COLORS = ['#ff8fc0', '#b98bff', '#ffd27a', '#8ff0d6', '#ff5fa6'];

  function burstConfetti(count = 90) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: rand(0, confettiCanvas.width),
        y: -20,
        vx: rand(-2, 2),
        vy: rand(2, 5),
        size: rand(5, 10),
        color: choice(CONFETTI_COLORS),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.2, 0.2),
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(confettiTick);
    }
  }

  function confettiTick() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.rot += p.vr;
    });
    confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 30);
    confettiParticles.forEach(p => {
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        cctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        cctx.beginPath();
        cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        cctx.fill();
      }
      cctx.restore();
    });
    if (confettiParticles.length > 0) {
      requestAnimationFrame(confettiTick);
    } else {
      confettiRunning = false;
    }
  }

  /* =========================================================
     FIREWORKS (DOM particle bursts)
     ========================================================= */
  function launchFireworks(container, bursts = 5) {
    if (prefersReducedMotion) return;
    for (let b = 0; b < bursts; b++) {
      setTimeout(() => {
        const cx = rand(15, 85);
        const cy = rand(15, 55);
        const color = choice(CONFETTI_COLORS);
        for (let i = 0; i < 22; i++) {
          const angle = (Math.PI * 2 * i) / 22;
          const dist = rand(40, 110);
          const p = document.createElement('span');
          p.className = 'firework-particle';
          p.style.left = cx + '%';
          p.style.top = cy + '%';
          p.style.background = color;
          p.style.boxShadow = `0 0 8px 2px ${color}`;
          p.style.transition = 'transform 1s cubic-bezier(.2,.7,.3,1), opacity 1s ease';
          container.appendChild(p);
          requestAnimationFrame(() => {
            p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 20}px)`;
            p.style.opacity = '0';
          });
          setTimeout(() => p.remove(), 1050);
        }
      }, b * 380);
    }
  }

  /* =========================================================
     GENERIC POPUPS
     ========================================================= */
  function openPopup(id) {
    $('#' + id).classList.add('open');
  }
  function closePopup(id) {
    $('#' + id).classList.remove('open');
  }
  $$('[data-close-popup]').forEach(btn => {
    btn.addEventListener('click', () => closePopup(btn.dataset.closePopup));
  });
  $$('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  function showGenericPopup(emoji, title, body) {
    $('#genericEmoji').textContent = emoji;
    $('#genericTitle').textContent = title;
    $('#genericBody').textContent = body;
    openPopup('genericPopup');
  }

  /* =========================================================
     START SURPRISE BUTTON
     ========================================================= */
  $('#startBtn').addEventListener('click', () => {
    setMusic(true);
    burstConfetti(140);
    $('#message').scrollIntoView({ behavior: 'smooth' });
  });

  /* hide scroll hint once user scrolls */
  window.addEventListener('scroll', () => {
    const hint = $('#scrollHint');
    if (hint) hint.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });

  /* =========================================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  function observeReveal(el) { revealObserver.observe(el); }

  $$('.anim-line').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    observeReveal(el);
  });

  /* =========================================================
     SECTION 2 — GALLERY
     ========================================================= */
  const GALLERY_CAPTIONS = [
    'The cutest little girl who grew into an amazing friend ❤️', 'Just another random college break that turned into a beautiful memory', "You gave me this flower... a small gift that became a beautiful memory I'll always cherish",
    'Random bus ride... endless conversations... unforgettable memories', 'One of my favorite photos because your smile says everything', 'Same dress, same pose, same crazy friendship. One of my favorite moments',
    "A selfie where you were admiring me... one of those little moments I'll never forget", 'Three friends, one internship, countless memories made together in Chennai'
  ];
  const galleryGrid = $('#galleryGrid');
  const galleryData = [];
  for (let i = 1; i <= 8; i++) {
    galleryData.push({ src: `photo${i}.jpg`, caption: GALLERY_CAPTIONS[i - 1] });
  }
  galleryData.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'gallery-item reveal';
    div.dataset.index = idx;
    div.innerHTML = `
      <img src="${item.src}" alt="${item.caption}" loading="lazy"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="gallery-fallback" style="display:none;">
        <span class="icon">🖼️</span><span>${item.caption}</span>
      </div>
      <p class="gallery-caption">${item.caption}</p>`;
    div.addEventListener('click', () => openLightbox(idx));
    galleryGrid.appendChild(div);
    observeReveal(div);
  });
  // Since images will 404 (no real files), reveal fallback immediately too
  $$('.gallery-item img').forEach(img => {
    img.addEventListener('error', () => {});
  });

  let lightboxIndex = 0;
  function openLightbox(idx) {
    lightboxIndex = idx;
    renderLightbox();
    $('#lightbox').classList.add('open');
  }
  function renderLightbox() {
    const item = galleryData[lightboxIndex];
    const imgWrap = $('#lightboxImg');
    imgWrap.innerHTML = `<img src="${item.src}" alt="${item.caption}" onerror="this.remove(); this.parentElement.textContent='🖼️';">`;
    $('#lightboxCaption').textContent = item.caption;
  }
  $('#lightboxClose').addEventListener('click', () => $('#lightbox').classList.remove('open'));
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') $('#lightbox').classList.remove('open'); });
  $('#lightboxPrev').addEventListener('click', () => { lightboxIndex = (lightboxIndex - 1 + galleryData.length) % galleryData.length; renderLightbox(); });
  $('#lightboxNext').addEventListener('click', () => { lightboxIndex = (lightboxIndex + 1) % galleryData.length; renderLightbox(); });

  let slideshowTimer = null;
  $('#slideshowBtn').addEventListener('click', () => {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
      $('#slideshowBtn').textContent = '▶ Slideshow';
      return;
    }
    openLightbox(0);
    $('#slideshowBtn').textContent = '⏸ Stop Slideshow';
    slideshowTimer = setInterval(() => {
      lightboxIndex = (lightboxIndex + 1) % galleryData.length;
      renderLightbox();
    }, 2200);
  });


  /* =========================================================
     SECTION 4 — GIFT HUNT
     ========================================================= */
  const giftGrid = $('#giftGrid');
  const correctIndex = randInt(0, 8);
  const wrongMessages = ['Nope 😂', 'Try again 😄', 'Almost 😆', 'Not this one!', 'Ooh so close 😏', 'Keep hunting 🔍'];
  for (let i = 0; i < 9; i++) {
    const box = document.createElement('button');
    box.className = 'gift-box';
    box.textContent = '🎁';
    box.setAttribute('aria-label', 'Gift box ' + (i + 1));
    box.addEventListener('click', () => {
      if (i === correctIndex) {
        box.classList.add('correct');
        box.textContent = '💝';
        playChime();
        burstConfetti(150);
        $('#giftHint').textContent = 'You found it! 🎉';
        openPopup('giftPopup');
      } else {
        box.classList.remove('wrong');
        void box.offsetWidth;
        box.classList.add('wrong');
        $('#giftHint').textContent = choice(wrongMessages);
        playPop();
      }
    });
    giftGrid.appendChild(box);
  }

  /* =========================================================
     GAME 1 — POP THE BALLOONS
     ========================================================= */
  const BALLOON_TOTAL = 15;
  $('#balloonTotal').textContent = BALLOON_TOTAL;
  let balloonScore = 0;
  const balloonStage = $('#balloonStage');
  const balloonEmojis = ['🎈', '🎈', '🎈'];
  const balloonColorsCss = ['hue-rotate(0deg)', 'hue-rotate(60deg)', 'hue-rotate(200deg)', 'hue-rotate(280deg)'];

  function spawnBalloons() {
    balloonStage.innerHTML = '';
    balloonScore = 0;
    $('#balloonScore').textContent = 0;
    for (let i = 0; i < BALLOON_TOTAL; i++) {
      const b = document.createElement('span');
      b.className = 'pop-balloon';
      b.textContent = choice(balloonEmojis);
      b.style.left = rand(2, 90) + '%';
      b.style.animationDuration = rand(6, 11) + 's';
      b.style.animationDelay = rand(0, 4) + 's';
      b.style.filter = choice(balloonColorsCss);
      b.addEventListener('click', () => popBalloon(b));
      balloonStage.appendChild(b);
    }
  }
  function popBalloon(b) {
    if (b.classList.contains('popped')) return;
    b.classList.add('popped');
    b.textContent = '💥';
    playPop();
    balloonScore++;
    $('#balloonScore').textContent = balloonScore;
    setTimeout(() => b.remove(), 200);
    if (balloonScore >= BALLOON_TOTAL) {
      launchFireworks(balloonStage, 4);
      burstConfetti(100);
      setTimeout(() => showGenericPopup('🎈', 'All Popped!', 'You popped every single balloon — Happy Birthday energy achieved!'), 300);
      markComplete('balloons');
    }
  }
  $('#balloonReset').addEventListener('click', spawnBalloons);
  spawnBalloons();

  /* =========================================================
     GAME 2 — FRIENDSHIP QUIZ
     ========================================================= */
  const QUIZ = [
  {
    q: "Who is today's Birthday Queen?",
    options: [
      "Divasini, obviously 👑",
      "A random stranger",
      "Me (definitely not 😂)"
    ],
    answer: 0,
    fun: "Correct! The Birthday Queen is Divasini! 👑🎉"
  },
  {
    q: "What's our favorite college memory?",
    options: [
      "Endless canteen gossip with chips, rolls & paal bun 😂",
      "Sitting quietly without talking 🤐",
      "Listening carefully to every lecture 📚"
    ],
    answer: 0,
    fun: "Exactly! Those canteen gossip sessions were unforgettable! 😂❤️"
  },
  {
    q: "Who always has the cutest smile?",
    options: [
      "Someone we don't know 🤔",
      "Divasini, without any doubt 😊",
      "Our attendance sheet 😂"
    ],
    answer: 1,
    fun: "Of course! Divasini's smile always wins! ✨💖"
  }
];
  let quizIndex = 0;
  const quizBody = $('#quizBody');
  function renderQuiz() {
    if (quizIndex >= QUIZ.length) {
      quizBody.innerHTML = `<p class="quiz-feedback" style="font-size:1.05rem;">You aced the Friendship Quiz! 💌</p>`;
      $('#quizProgress').textContent = 'Complete!';
      showGenericPopup('💌', 'Quiz Complete!', 'Perfect friendship score — as expected.');
      markComplete('quiz');
      return;
    }
    const item = QUIZ[quizIndex];
    $('#quizProgress').textContent = `Question ${quizIndex + 1}/${QUIZ.length}`;
    quizBody.innerHTML = `
      <p class="quiz-question">${item.q}</p>
      <div class="quiz-options">
        ${item.options.map((opt, i) => `<button class="quiz-option" data-i="${i}">${opt}</button>`).join('')}
      </div>
      <p class="quiz-feedback" id="quizFeedback"></p>
      <button class="pill-btn quiz-next" id="quizNextBtn" style="display:none;">Next →</button>`;
    $$('.quiz-option', quizBody).forEach(btn => {
      btn.addEventListener('click', () => {
        if (quizBody.dataset.answered === 'true') return;
        quizBody.dataset.answered = 'true';
        const i = Number(btn.dataset.i);
        $$('.quiz-option', quizBody).forEach(b => b.disabled = true);
        btn.classList.add('selected');
        $('#quizFeedback').textContent = i === item.answer ? item.fun : `Sweet try 😄 — but it's "${item.options[item.answer]}"!`;
        playChime();
        $('#quizNextBtn').style.display = 'inline-block';
      });
    });
    $('#quizNextBtn')?.addEventListener('click', () => { quizIndex++; quizBody.dataset.answered = 'false'; renderQuiz(); });
  }
  renderQuiz();

  /* =========================================================
     GAME 3 — CATCH THE HEARTS
     ========================================================= */
  const catchStage = $('#catchStage');
  const catchBasket = $('#catchBasket');
  let catchScore = 0;
  let catchRunning = false;
  let basketPct = 50;
  let catchInterval = null;
  let catchSpawnInterval = null;

  function setBasketPos() {
    const stageW = catchStage.clientWidth;
    const basketW = 44;
    const px = (basketPct / 100) * (stageW - basketW);
    catchBasket.style.left = px + 'px';
  }
  window.addEventListener('resize', setBasketPos);

  document.addEventListener('keydown', (e) => {
    if (!catchRunning) return;
    if (e.key === 'ArrowLeft') { basketPct = Math.max(0, basketPct - 6); setBasketPos(); }
    if (e.key === 'ArrowRight') { basketPct = Math.min(100, basketPct + 6); setBasketPos(); }
  });
  let dragging = false;
  catchStage.addEventListener('pointerdown', () => { if (catchRunning) dragging = true; });
  window.addEventListener('pointerup', () => dragging = false);
  catchStage.addEventListener('pointermove', (e) => {
    if (!dragging || !catchRunning) return;
    const rect = catchStage.getBoundingClientRect();
    basketPct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    setBasketPos();
  });

  function spawnFallingHeart() {
    const h = document.createElement('span');
    h.className = 'falling-heart';
    const leftPct = rand(2, 92);
    h.style.left = leftPct + '%';
    h.textContent = choice(['💗', '❤️', '💕']);
    catchStage.appendChild(h);
    let y = -30;
    const speed = rand(1.6, 3);
    const fall = setInterval(() => {
      y += speed;
      h.style.top = y + 'px';
      const stageH = catchStage.clientHeight;
      const basketRect = catchBasket.getBoundingClientRect();
      const heartRect = h.getBoundingClientRect();
      const overlap = !(heartRect.right < basketRect.left || heartRect.left > basketRect.right ||
        heartRect.bottom < basketRect.top || heartRect.top > basketRect.bottom);
      if (overlap && y > stageH - 90) {
        clearInterval(fall);
        h.remove();
        catchScore = Math.min(100, catchScore + 5);
        $('#catchScore').textContent = catchScore;
        playPop();
        if (catchScore >= 100) endCatchGame();
      } else if (y > stageH) {
        clearInterval(fall);
        h.remove();
      }
    }, 16);
  }

  function endCatchGame() {
    catchRunning = false;
    clearInterval(catchSpawnInterval);
    $$('.falling-heart', catchStage).forEach(el => el.remove());
    const secret = $('#catchSecret');
    secret.textContent = '🔓 Secret message: You\'ve caught every version of "thank you for being you." Happy Birthday!';
    secret.classList.add('show');
    burstConfetti(100);
    markComplete('catch');
  }

  $('#catchStart').addEventListener('click', () => {
    catchScore = 0;
    $('#catchScore').textContent = 0;
    $('#catchSecret').classList.remove('show');
    catchRunning = true;
    basketPct = 50;
    setBasketPos();
    $('#catchStart').style.display = 'none';
    catchSpawnInterval = setInterval(spawnFallingHeart, 550);
  });

  /* =========================================================
     GAME 4 — MEMORY MATCH
     ========================================================= */
  const memoryEmojis = ['❤️', '🎂', '🎁', '🎈', '🌸', '🍰'];
  const memoryGrid = $('#memoryGrid');
  let memoryFirst = null, memoryLock = false, memoryMoves = 0, memoryMatched = 0;

  function buildMemoryGame() {
    memoryGrid.innerHTML = '';
    memoryMoves = 0; memoryMatched = 0; memoryFirst = null; memoryLock = false;
    $('#memoryMoves').textContent = 0;
    const deck = [...memoryEmojis, ...memoryEmojis]
      .map(v => ({ v, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(x => x.v);
    deck.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.emoji = emoji;
      card.dataset.idx = idx;
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-face memory-front">✦</div>
          <div class="memory-face memory-back">${emoji}</div>
        </div>`;
      card.addEventListener('click', () => flipMemoryCard(card));
      memoryGrid.appendChild(card);
    });
  }

  function flipMemoryCard(card) {
    if (memoryLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    if (!memoryFirst) {
      memoryFirst = card;
      return;
    }
    memoryMoves++;
    $('#memoryMoves').textContent = memoryMoves;
    if (memoryFirst.dataset.emoji === card.dataset.emoji && memoryFirst !== card) {
      memoryFirst.classList.add('matched');
      card.classList.add('matched');
      memoryFirst = null;
      memoryMatched++;
      playChime();
      if (memoryMatched === memoryEmojis.length) {
        setTimeout(() => {
          burstConfetti(90);
          showGenericPopup('🧠', 'Memory Master!', `Matched everything in ${memoryMoves} moves. Surprise unlocked!`);
          markComplete('memory');
        }, 400);
      }
    } else {
      memoryLock = true;
      setTimeout(() => {
        card.classList.remove('flipped');
        memoryFirst.classList.remove('flipped');
        memoryFirst = null;
        memoryLock = false;
      }, 800);
    }
  }
  buildMemoryGame();

  /* =========================================================
     GAME 5 — BLOW THE CANDLE
     ========================================================= */
  const flames = [$('#flame1'), $('#flame2'), $('#flame3')];
  let candlesBlown = false;
  $('#blowBtn').addEventListener('click', () => {
    if (candlesBlown) return;
    candlesBlown = true;
    flames.forEach((f, i) => {
      setTimeout(() => {
        f.classList.add('out');
        const smoke = document.createElement('span');
        smoke.className = 'smoke';
        smoke.style.left = (i * 43 + 44) + 'px';
        $('#cakeEl').appendChild(smoke);
        setTimeout(() => smoke.remove(), 1500);
      }, i * 180);
    });
    setTimeout(() => {
      launchFireworks($('#fireworksLayer'), 5);
      burstConfetti(120);
      setMusic(true);
      showGenericPopup('🕯️', 'Wish Granted!', 'All candles blown out — whatever you wished for, may it come true this year.');
      markComplete('candle');
      $('#blowBtn').textContent = 'Relight & Blow Again 🔁';
    }, 700);
  });
  $('#blowBtn').addEventListener('dblclick', () => {
    // allow replay for fun
  });
  // allow re-trigger by resetting state when clicked after completion
  $('#blowBtn').addEventListener('click', function relight() {
    if (candlesBlown) {
      setTimeout(() => {
        flames.forEach(f => f.classList.remove('out'));
        candlesBlown = false;
        $('#blowBtn').textContent = 'Blow the Candles 💨';
      }, 50);
    }
  });

  /* =========================================================
     GAME 6 — SPIN THE WHEEL
     ========================================================= */
  const WHEEL_PRIZES = [
    { label: 'Cake 🍰', color: '#ff8fc0' }, { label: 'Chocolate 🍫', color: '#b98bff' },
    { label: 'Hug 🤗', color: '#ffd27a' }, { label: 'Smile 😊', color: '#8ff0d6' },
    { label: 'Gift 🎁', color: '#ff5fa6' }, { label: 'Movie 🍿', color: '#c9a4ff' },
    { label: 'Friendship ❤️', color: '#ffb6d9' }
  ];
  const wheelEl = $('#wheelEl');
  const sliceAngle = 360 / WHEEL_PRIZES.length;
  const gradientParts = WHEEL_PRIZES.map((p, i) => `${p.color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`).join(',');
  wheelEl.style.background = `conic-gradient(${gradientParts})`;
  WHEEL_PRIZES.forEach((p, i) => {
    const label = document.createElement('div');
    label.className = 'wheel-slice';
    label.style.transform = `rotate(${i * sliceAngle + sliceAngle / 2}deg)`;
    label.innerHTML = `<span style="display:inline-block; transform:translateY(6px); font-size:0.85rem;">${p.label}</span>`;
    wheelEl.appendChild(label);
  });
  let wheelRotation = 0;
  let wheelSpun = false;
  $('#spinBtn').addEventListener('click', () => {
    const prizeIndex = randInt(0, WHEEL_PRIZES.length - 1);
    const targetAngle = 360 * 5 + (360 - (prizeIndex * sliceAngle + sliceAngle / 2));
    wheelRotation = targetAngle;
    wheelEl.style.transform = `rotate(${wheelRotation}deg)`;
    playChime();
    setTimeout(() => {
      const prize = WHEEL_PRIZES[prizeIndex];
      showGenericPopup('🎡', 'You Landed On...', `${prize.label} — enjoy your prize!`);
      burstConfetti(80);
      if (!wheelSpun) { wheelSpun = true; markComplete('wheel'); }
    }, 4100);
  });

  /* =========================================================
     SECTION 6 — OPEN LETTERS
     ========================================================= */
  const LETTERS = [
    { icon: '💌', title: 'Things I Appreciate', body: 'Your honesty, your patience, and the way you make everyone around you feel a little less alone. You notice people. That\'s rare.' },
    { icon: '😂', title: 'Funny Memories', body: 'Remember the time we convinced ourselves we\'d "study for an hour" and ended up talking for three? A classic. Every time.' },
    { icon: '🎓', title: 'College Moments', body: 'From nervous first-semester jitters to somehow surviving finals week together — what a ride this has been.' },
    { icon: '🎁', title: 'Birthday Wishes', body: 'Wishing you a year that\'s louder in laughter, softer in stress, and full of everything you\'ve been quietly hoping for.' },
    { icon: '🔮', title: 'Future Wishes', body: 'Here\'s to more years of chaos, more inside jokes, and a friendship that outlasts every group chat rename.' }
  ];
  const envelopeRow = $('#envelopeRow');
  LETTERS.forEach((letter) => {
    const env = document.createElement('div');
    env.className = 'envelope';
    env.innerHTML = `
      <div class="envelope-body">${letter.icon}</div>
      <div class="envelope-flap"></div>
      <p class="envelope-label">tap to open</p>`;
    env.addEventListener('click', () => {
      env.classList.add('open');
      playChime();
      setTimeout(() => {
        $('#genericEmoji').textContent = letter.icon;
        $('#genericTitle').textContent = letter.title;
        $('#genericBody').innerHTML = `<span class="letter-popup-body">${letter.body}</span>`;
        openPopup('genericPopup');
      }, 350);
    });
    envelopeRow.appendChild(env);
  });

  /* =========================================================
     SECTION 7 — REASONS YOU'RE AMAZING
     ========================================================= */
  const REASONS = [
    { icon: '😊', title: 'Your Smile', text: 'Instantly makes any bad day better.' },
    { icon: '🤍', title: 'Your Kindness', text: 'Shown in a hundred small, quiet ways.' },
    { icon: '🤝', title: 'Your Friendship', text: 'Steady, loyal, and endlessly fun.' },
    { icon: '🌞', title: 'Your Positivity', text: 'Finds the bright side, even on gray days.' },
    { icon: '💪', title: 'Your Support', text: 'Always there, no matter the hour.' }
  ];
  const reasonsGrid = $('#reasonsGrid');
  REASONS.forEach(r => {
    const div = document.createElement('div');
    div.className = 'reason-card reveal';
    div.innerHTML = `<div class="reason-icon">${r.icon}</div><h4>${r.title}</h4><p>${r.text}</p>`;
    reasonsGrid.appendChild(div);
    observeReveal(div);
  });

  /* =========================================================
     SECTION 8 — SECRET ENDING
     ========================================================= */
  $('#unlockBtn').addEventListener('click', () => {
    if (completed.size < GAMES.length) return;
    const finale = $('#finale');
    finale.hidden = false;
    buildFinaleCollage();
    finale.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      launchFireworks($('#finaleCanvas'), 8);
      burstConfetti(180);
    }, 500);
  });

  function buildFinaleCollage() {
    const collage = $('#finaleCollage');
    if (collage.childElementCount) return;
    const icons = ['❤️', '🎂', '🎓', '🤳', '🎈', '🌸', '🍰', '✨'];
    icons.forEach((icon, i) => {
      const d = document.createElement('div');
      d.className = 'mini-photo';
      d.style.setProperty('--r', rand(-8, 8) + 'deg');
      d.textContent = icon;
      collage.appendChild(d);
    });
  }

  $('#replayBtn').addEventListener('click', () => {
    launchFireworks($('#finaleCanvas'), 6);
    burstConfetti(150);
  });

})();