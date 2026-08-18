/* ============================================================
   Abhiroop Mareedu — site behaviour
   Vanilla JS, no dependencies. Everything degrades gracefully.
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── theme ────────────────────────────────────────────── */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('am-theme');
  if (savedTheme) root.dataset.theme = savedTheme;
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';

  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('am-theme', next);
    $('meta[name="theme-color"]').setAttribute('content', next === 'dark' ? '#08090a' : '#f7f6f3');
    toast(next === 'dark' ? 'Lights off' : 'Lights on');
  }
  $('#theme-toggle').addEventListener('click', toggleTheme);

  /* ── toast ────────────────────────────────────────────── */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 1900);
  }

  /* ── clock, in IST, because that is where I am ────────── */
  const clockEl = $('#clock-time');
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const tick = () => { clockEl.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 1000);
  $('#year').textContent = new Date().getFullYear();

  /* ── ticker ───────────────────────────────────────────── */
  const TICKER = [
    'LiveKit', 'Deepgram', 'Cartesia', 'ElevenLabs', 'WebRTC', 'Twilio', 'SIP / PSTN',
    'Streaming transcription', 'Interruption handling', 'Multi-model routing', 'RAG',
    'Langfuse', 'LLM-as-a-Judge', 'Red-teaming', 'TypeScript', 'Python', 'React Native', 'Kubernetes'
  ];
  const track = $('#ticker-track');
  const row = TICKER.map(t => `<span>${t}</span>`).join('');
  track.innerHTML = row + row; // duplicated for a seamless -50% loop

  /* ── scroll progress + sticky bar ─────────────────────── */
  const bar = $('#progress-bar');
  const topbar = $('#topbar');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      topbar.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── reveal on scroll ─────────────────────────────────── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  // stagger siblings inside the same block so groups arrive as a wave
  const groups = new Map();
  $$('.reveal').forEach((el) => {
    const key = el.parentElement;
    const i = groups.get(key) ?? 0;
    groups.set(key, i + 1);
    el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms');
    revealIO.observe(el);
  });

  // the hero should not wait for a scroll event
  requestAnimationFrame(() => {
    $$('#hero .reveal').forEach(el => el.classList.add('is-in'));
  });

  /* ── animated stat counters ───────────────────────────── */
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      statIO.unobserve(el);
      if (reduceMotion) return;
      const target = parseInt(el.dataset.count, 10);
      const pre = el.dataset.prefix || '';
      const post = el.dataset.suffix || '';
      const t0 = performance.now();
      const dur = 1100;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * eased) + post;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('.stat-num[data-count]').forEach(el => statIO.observe(el));

  /* ── work accordion ───────────────────────────────────── */
  $$('.role-head').forEach((head) => {
    head.addEventListener('click', () => {
      const role = head.closest('.role');
      const open = role.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* ── card cursor glow ─────────────────────────────────── */
  $$('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── hero glow follows the pointer ────────────────────── */
  const glow = $('#hero-glow');
  const hero = $('#hero');
  let glowX = window.innerWidth * 0.62, glowY = window.innerHeight * 0.42;
  let glowTX = glowX, glowTY = glowY;
  hero.addEventListener('pointermove', (e) => { glowTX = e.clientX; glowTY = e.clientY; });

  /* ── scroll spy ───────────────────────────────────────── */
  const navLinks = $$('[data-nav]');
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'builds', 'stack', 'about', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) spyIO.observe(el);
  });

  /* ══════════════════════════════════════════════════════
     The signal — a synthesised speech waveform behind the hero.
     Layered sines with an amplitude envelope that breathes like
     a voice, plus a bump that follows the cursor.
     ══════════════════════════════════════════════════════ */
  const canvas = $('#signal');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, raf = 0, running = true;
  let px = -9999, py = -9999, pStrength = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top; pStrength = 1;
  });
  hero.addEventListener('pointerleave', () => { pStrength = 0; });

  // a cheap, deterministic "speech envelope": a few incommensurate sines
  function envelope(x, t) {
    return (
      0.55 + 0.45 * Math.sin(x * 0.0042 + t * 0.7) *
      Math.sin(x * 0.0011 - t * 0.43) *
      Math.sin(t * 0.9 + x * 0.0006)
    );
  }

  const LAYERS = [
    { amp: 1.00, freq: 0.0125, speed: 1.35, width: 1.5, alpha: 1.00 },
    { amp: 0.62, freq: 0.0208, speed: -1.9, width: 1.1, alpha: 0.55 },
    { amp: 0.38, freq: 0.0345, speed: 2.6,  width: 0.9, alpha: 0.32 }
  ];

  function draw(now) {
    raf = requestAnimationFrame(draw);
    if (!running) return;

    const t = now / 1000;
    ctx.clearRect(0, 0, W, H);

    const mid = H * 0.52;
    const base = Math.min(H * 0.13, 110);
    const styles = getComputedStyle(root);
    const signalColor = styles.getPropertyValue('--signal').trim() || 'rgba(255,255,255,.3)';
    const accent = styles.getPropertyValue('--accent').trim() || '#ff4d00';

    // smooth the cursor bump in and out
    pStrength += ((py > -1 ? 1 : 0) - pStrength) * 0.06;

    const step = W < 700 ? 4 : 3;

    LAYERS.forEach((L, li) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += step) {
        const env = envelope(x, t * 0.55 + li * 3.1);
        // gaussian bump around the pointer — the waveform "hears" the cursor
        const d = (x - px) / 190;
        const bump = pStrength * Math.exp(-d * d) * 1.9;
        const a = base * L.amp * (0.35 + env * 0.9) * (1 + bump);
        const y = mid + Math.sin(x * L.freq + t * L.speed) * a * 0.5;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = li === 0 ? accent : signalColor;
      ctx.globalAlpha = li === 0 ? 0.22 + pStrength * 0.16 : L.alpha * 0.30;
      ctx.lineWidth = L.width;
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // sampling ticks along the baseline — the discrete half of the signal
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = signalColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = (t * 26) % 44; x < W; x += 44) {
      const env = envelope(x, t * 0.55);
      const h = 3 + env * 9;
      ctx.moveTo(x, mid + base * 0.95 - h);
      ctx.lineTo(x, mid + base * 0.95 + h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // ease the hero glow toward the pointer
    glowX += (glowTX - glowX) * 0.045;
    glowY += (glowTY - glowY) * 0.045;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
  }

  if (!reduceMotion) {
    raf = requestAnimationFrame(draw);
    // stop painting when the hero is off screen or the tab is hidden
    const heroIO = new IntersectionObserver(([e]) => { running = e.isIntersecting; }, { threshold: 0 });
    heroIO.observe(hero);
    document.addEventListener('visibilitychange', () => { running = !document.hidden; });
  } else {
    // a single static frame, so the hero is not empty
    draw(0); cancelAnimationFrame(raf); running = false;
  }

  /* ══════════════════════════════════════════════════════
     Command palette
     ══════════════════════════════════════════════════════ */
  const ICONS = {
    jump: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15"/></svg>',
    link: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18 18 6M9 6h9v9"/></svg>',
    doc:  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.2 1 1.9h5.2c.1-.7.4-1.4 1-1.9A6 6 0 0 0 12 3Z"/></svg>'
  };

  const goto = (sel) => () => {
    const el = $(sel);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  const copy = (text, label) => async () => {
    try { await navigator.clipboard.writeText(text); toast(label + ' copied'); }
    catch { toast(text); }
  };

  const COMMANDS = [
    { label: 'Go to Work',    hint: 'section 01', icon: 'jump', run: goto('#work') },
    { label: 'Go to Builds',  hint: 'section 02', icon: 'jump', run: goto('#builds') },
    { label: 'Go to Stack',   hint: 'section 03', icon: 'jump', run: goto('#stack') },
    { label: 'Go to About',   hint: 'section 04', icon: 'jump', run: goto('#about') },
    { label: 'Go to Contact', hint: 'section 05', icon: 'jump', run: goto('#contact') },
    { label: 'Copy email address', hint: 'abhiroopmareedu@gmail.com', icon: 'copy', run: copy('abhiroopmareedu@gmail.com', 'Email') },
    { label: 'Copy phone number',  hint: '+91 76759 23496', icon: 'copy', run: copy('+917675923496', 'Number') },
    { label: 'Write me an email',  hint: 'mailto', icon: 'link', run: () => { window.location.href = 'mailto:abhiroopmareedu@gmail.com'; } },
    { label: 'Open GitHub',   hint: 'roopo21',    icon: 'link', run: () => window.open('https://github.com/roopo21', '_blank', 'noopener') },
    { label: 'Open LinkedIn', hint: 'abhiroop-m', icon: 'link', run: () => window.open('https://linkedin.com/in/abhiroop-m', '_blank', 'noopener') },
    { label: 'Download résumé', hint: 'PDF', icon: 'doc', run: () => window.open('Abhiroop_Mareedu_Resume.pdf', '_blank', 'noopener') },
    { label: 'Toggle light / dark', hint: 'theme', icon: 'bulb', run: toggleTheme },
    { label: 'Expand every role', hint: 'work history', icon: 'bulb', run: () => {
        $$('.role').forEach(r => { r.classList.add('is-open'); $('.role-head', r).setAttribute('aria-expanded', 'true'); });
        goto('#work')();
      } }
  ];

  const palette = $('#palette');
  const search  = $('#palette-search');
  const list    = $('#palette-list');
  let filtered = COMMANDS.slice();
  let cursor = 0;
  let lastFocus = null;

  function render() {
    if (!filtered.length) { list.innerHTML = '<li class="palette-empty">Nothing matches that.</li>'; return; }
    list.innerHTML = filtered.map((c, i) => `
      <li role="option" aria-selected="${i === cursor}" data-i="${i}">
        <span class="p-ico">${ICONS[c.icon]}</span>
        <span>${c.label}</span>
        <span class="p-hint">${c.hint}</span>
      </li>`).join('');
  }

  function openPalette() {
    lastFocus = document.activeElement;
    palette.hidden = false;
    search.value = ''; filtered = COMMANDS.slice(); cursor = 0;
    render();
    search.focus();
    document.body.style.overflow = 'hidden';
  }
  function closePalette() {
    palette.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function runCurrent() {
    const cmd = filtered[cursor];
    if (!cmd) return;
    closePalette();
    setTimeout(cmd.run, 60);
  }

  $('#palette-open').addEventListener('click', openPalette);
  $('#palette-open-2').addEventListener('click', openPalette);
  $('[data-close]', palette).addEventListener('click', closePalette);

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    filtered = COMMANDS.filter(c => (c.label + ' ' + c.hint).toLowerCase().includes(q));
    cursor = 0;
    render();
  });

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-i]');
    if (!li) return;
    cursor = Number(li.dataset.i);
    runCurrent();
  });
  list.addEventListener('pointermove', (e) => {
    const li = e.target.closest('li[data-i]');
    if (!li || Number(li.dataset.i) === cursor) return;
    cursor = Number(li.dataset.i);
    render();
  });

  document.addEventListener('keydown', (e) => {
    const open = !palette.hidden;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open ? closePalette() : openPalette();
      return;
    }
    if (!open) {
      // "/" opens it too, as long as you are not typing in a field
      if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); openPalette();
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cursor = (cursor + 1) % filtered.length; render(); scrollCursorIntoView(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); cursor = (cursor - 1 + filtered.length) % filtered.length; render(); scrollCursorIntoView(); }
    else if (e.key === 'Enter')     { e.preventDefault(); runCurrent(); }
  });

  function scrollCursorIntoView() {
    const el = list.querySelector('[aria-selected="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  /* ── a note for whoever opens the console ─────────────── */
  console.log(
    '%cAbhiroop Mareedu%c\nBuilt by hand — no framework, no template.\nThe hero waveform is a canvas; it reacts to your cursor.\nPress ⌘K.\n\nabhiroopmareedu@gmail.com',
    'font:600 20px/1.2 system-ui;color:#ff4d00', 'font:13px/1.6 system-ui;color:#888'
  );
})();
