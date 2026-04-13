/**
 * ListenFlow — Content Script
 * Injects a floating TTS overlay on every page.
 *
 * Flow:
 *   click 🎧 → detectContent() → speakText() → mini-player appears
 *   click again (or ⏹) → stop
 */

(function () {
  'use strict';

  // Guard against double-injection (e.g. SPA navigation + back/forward)
  if (window.__listenFlowLoaded) return;
  window.__listenFlowLoaded = true;

  // ── State ────────────────────────────────────────────────────────────────

  const state = {
    playing:    false,
    paused:     false,
    speed:      1.0,
    chunks:     [],   // text split into bite-sized utterances
    chunkIndex: 0,
  };

  // ── Known chat-app hostnames ─────────────────────────────────────────────

  const CHAT_HOSTS = [
    'chatgpt.com', 'chat.openai.com',
    'perplexity.ai',
    'claude.ai',
    'gemini.google.com', 'bard.google.com',
    'poe.com', 'character.ai',
    'copilot.microsoft.com', 'bing.com',
    'you.com', 'phind.com',
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  //  UI INJECTION
  // ═══════════════════════════════════════════════════════════════════════════

  function injectUI() {
    // ── Floating button ──────────────────────────────────────────────────
    const btn = document.createElement('div');
    btn.id = 'lf-btn';
    btn.setAttribute('data-listenflow', 'true');
    btn.setAttribute('title', 'ListenFlow — click to listen');
    btn.innerHTML = `<span class="lf-btn-icon">🎧</span>`;

    // ── Mini player ──────────────────────────────────────────────────────
    const player = document.createElement('div');
    player.id = 'lf-player';
    player.setAttribute('data-listenflow', 'true');
    player.innerHTML = `
      <div class="lf-controls">
        <button id="lf-pause" title="Pause / Resume">⏸</button>
        <button id="lf-stop"  title="Stop">⏹</button>
        <button id="lf-speed" title="Cycle speed">1×</button>
      </div>
      <div id="lf-status" class="lf-status">Detecting…</div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(player);

    // ── Event listeners ──────────────────────────────────────────────────
    btn.addEventListener('click', onBtnClick);
    document.getElementById('lf-pause').addEventListener('click', togglePause);
    document.getElementById('lf-stop').addEventListener('click', () => stopSpeech(true));
    document.getElementById('lf-speed').addEventListener('click', cycleSpeed);

    makeDraggable(btn, player);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  DRAGGABLE BUTTON
  // ═══════════════════════════════════════════════════════════════════════════

  function makeDraggable(btn, player) {
    let dragging = false;
    let startX, startY, origLeft, origTop;
    let didDrag = false;

    btn.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging  = true;
      didDrag   = false;
      startX    = e.clientX;
      startY    = e.clientY;
      const r   = btn.getBoundingClientRect();
      origLeft  = r.left;
      origTop   = r.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true;
      const left = clamp(origLeft + dx, 0, window.innerWidth  - 56);
      const top  = clamp(origTop  + dy, 0, window.innerHeight - 56);
      positionUI(btn, player, left, top);
    });

    document.addEventListener('mouseup', () => { dragging = false; });

    // Suppress the click that follows a drag
    btn.addEventListener('click', (e) => {
      if (didDrag) { didDrag = false; e.stopImmediatePropagation(); }
    }, true);
  }

  /**
   * Pin the button at (left, top) and float the player above it.
   */
  function positionUI(btn, player, left, top) {
    btn.style.cssText = `left:${left}px;top:${top}px;right:auto;bottom:auto;`;
    const pLeft = clamp(left - 66, 4, window.innerWidth - 196);
    const pTop  = Math.max(top - 90, 4);
    player.style.cssText = `left:${pLeft}px;top:${pTop}px;right:auto;bottom:auto;`;
  }

  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

  // ═══════════════════════════════════════════════════════════════════════════
  //  CONTENT DETECTION
  // ═══════════════════════════════════════════════════════════════════════════

  function detectContent() {
    const host = location.hostname;
    const isChat = CHAT_HOSTS.some(h => host.includes(h));

    let text = null;

    if (isChat) {
      text = getChatContent();
    }

    if (!text || text.length < 100) {
      text = getArticleContent();
    }

    if (!text || text.length < 100) {
      text = getLargestBlock();
    }

    return text;
  }

  // ── Chat apps: grab the LAST visible assistant reply ─────────────────────

  function getChatContent() {
    const selectors = [
      // ChatGPT (new UI)
      '[data-message-author-role="assistant"] .markdown',
      '[data-message-author-role="assistant"]',
      // Perplexity
      '[data-testid="answer-text"]',
      '[data-testid="assistant-message"]',
      // Claude.ai
      '[data-is-streaming="false"] .font-claude-message',
      '.font-claude-message',
      // Generic patterns used by many chat UIs
      '.assistant-message .content',
      '.assistant-message',
      '.ai-response',
      '.bot-message',
      // Fallback markdown containers
      '.prose',
      '.markdown-body',
      '.markdown',
    ];

    for (const sel of selectors) {
      let matches;
      try { matches = document.querySelectorAll(sel); } catch (_) { continue; }
      if (!matches.length) continue;

      // Take the LAST element — most recent response in a chat
      const last = matches[matches.length - 1];
      if (!isVisible(last)) continue;
      const text = cleanText(last);
      if (text.length > 80) return text;
    }

    return null;
  }

  // ── Article / blog pages ──────────────────────────────────────────────────

  function getArticleContent() {
    const selectors = [
      'article',
      '[role="article"]',
      'main article',
      '.article-body', '.article__body', '.article-content',
      '.post-body',    '.post-content',  '.post__content',
      '.entry-content','.entry-body',
      '.story-body',   '.story__body',
      '.blog-post',    '.blog-content',
      'main .content', 'main .inner',
      '#article-body', '#post-body', '#main-content',
    ];

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el || !isVisible(el)) continue;
      const text = cleanText(el);
      if (text.length > 300) return text;
    }

    return null;
  }

  // ── Fallback: element with the most readable text ─────────────────────────

  function getLargestBlock() {
    const tags = ['section', 'div', 'p', 'main',
                  '[class*="content"]', '[class*="body"]',
                  '[class*="text"]', '[class*="post"]', '[class*="article"]'];
    let best = null, bestLen = 0;

    for (const tag of tags) {
      let els;
      try { els = document.querySelectorAll(tag); } catch (_) { continue; }
      for (const el of els) {
        if (!isVisible(el) || isChromeEl(el)) continue;
        const text = cleanText(el);
        if (text.length > bestLen) { best = el; bestLen = text.length; }
      }
    }

    if (best && bestLen > 100) return cleanText(best);

    // Absolute last resort
    const bodyText = cleanText(document.body);
    return bodyText.length > 50 ? bodyText.substring(0, 8000) : null;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Deep-clone the element, strip chrome/noise nodes, return plain text.
   */
  function cleanText(el) {
    const clone = el.cloneNode(true);

    // Remove ListenFlow's own elements first
    clone.querySelectorAll('[data-listenflow]').forEach(n => n.remove());

    const noiseSelectors = [
      'nav', 'header', 'footer', 'aside', 'button',
      '[role="navigation"]', '[role="button"]', '[role="complementary"]',
      '.nav', '.menu', '.sidebar', '.toolbar', '.breadcrumb',
      '.cookie', '.banner', '.modal', '.toast', '.tooltip',
      'script', 'style', 'noscript', 'iframe',
      '[aria-hidden="true"]',
    ];
    noiseSelectors.forEach(sel => {
      try { clone.querySelectorAll(sel).forEach(n => n.remove()); } catch (_) {}
    });

    return (clone.innerText || clone.textContent || '')
      .trim()
      .replace(/[ \t]+/g, ' ')       // collapse spaces/tabs
      .replace(/\n{3,}/g, '\n\n');   // collapse excess newlines
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    const s = getComputedStyle(el);
    return s.display !== 'none' &&
           s.visibility !== 'hidden' &&
           parseFloat(s.opacity) > 0;
  }

  /** Returns true for known UI chrome elements that are never main content. */
  function isChromeEl(el) {
    const tag  = el.tagName.toLowerCase();
    if (['nav','header','footer','aside','button','input',
         'select','textarea','form'].includes(tag)) return true;
    const role = (el.getAttribute('role') || '').toLowerCase();
    if (['navigation','banner','contentinfo','complementary',
         'search','dialog'].includes(role)) return true;
    const cn = (el.className || '').toLowerCase();
    return ['navbar','topbar','sidebar','toolbar','breadcrumb',
            'pagination','cookie-','modal','overlay','toast',
            'tooltip','ad-','advertisement'].some(k => cn.includes(k));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  TTS ENGINE
  // ═══════════════════════════════════════════════════════════════════════════

  function speakText(text) {
    stopSpeech(false);          // cancel any previous, keep player open

    if (!text || text.trim().length < 20) {
      setStatus('⚠ No readable content found.');
      setTimeout(() => hidePlayer(), 3000);
      return;
    }

    if (!window.speechSynthesis) {
      setStatus('⚠ Speech not supported.');
      setTimeout(() => hidePlayer(), 3000);
      return;
    }

    state.chunks     = chunkText(text.trim());
    state.chunkIndex = 0;
    state.playing    = true;
    state.paused     = false;

    updatePauseBtn();
    speakNext();
  }

  /**
   * Split text at sentence boundaries into ≤ maxLen chunks.
   * Keeps speech synthesis snappy and avoids the ~15-second Chrome
   * stuttering bug on very long single utterances.
   */
  function chunkText(text, maxLen = 600) {
    // Split on sentence-ending punctuation followed by whitespace
    const sentences = text
      .replace(/([.!?؟])\s+/g, '$1\n')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const chunks = [];
    let cur = '';

    for (const s of sentences) {
      if (cur.length + s.length + 1 > maxLen && cur) {
        chunks.push(cur.trim());
        cur = s;
      } else {
        cur += (cur ? ' ' : '') + s;
      }
    }
    if (cur.trim()) chunks.push(cur.trim());

    return chunks.length ? chunks : [text.substring(0, maxLen)];
  }

  function speakNext() {
    if (!state.playing || state.chunkIndex >= state.chunks.length) {
      onDone();
      return;
    }

    const u = new SpeechSynthesisUtterance(state.chunks[state.chunkIndex]);
    u.rate  = state.speed;
    u.pitch = 1;
    u.lang  = document.documentElement.lang || 'en-US';

    u.onend = () => {
      if (state.playing && !state.paused) {
        state.chunkIndex++;
        speakNext();
      }
    };

    u.onerror = (e) => {
      // 'interrupted' fires on cancel() — not a real error
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('ListenFlow TTS error:', e.error);
        setStatus('⚠ Speech error — try again.');
        onDone();
      }
    };

    window.speechSynthesis.speak(u);

    const pct = Math.round(((state.chunkIndex + 1) / state.chunks.length) * 100);
    setStatus(`${state.chunkIndex + 1} / ${state.chunks.length}  (${pct}%)`);
  }

  function togglePause() {
    if (!state.playing) return;
    if (state.paused) {
      state.paused = false;
      window.speechSynthesis.resume();
    } else {
      state.paused = true;
      window.speechSynthesis.pause();
    }
    updatePauseBtn();
  }

  /** @param {boolean} hideUi - whether to close the player panel */
  function stopSpeech(hideUi = true) {
    window.speechSynthesis.cancel();
    state.playing    = false;
    state.paused     = false;
    state.chunks     = [];
    state.chunkIndex = 0;
    if (hideUi) hidePlayer();
  }

  function cycleSpeed() {
    const options = [1, 1.5, 2, 0.75];
    const next    = options[(options.indexOf(state.speed) + 1) % options.length];
    state.speed   = next;
    document.getElementById('lf-speed').textContent = next + '×';

    // Apply immediately if already speaking
    if (state.playing && !state.paused) {
      window.speechSynthesis.cancel();
      speakNext();  // restarts current chunk at the new rate
    }
  }

  function onDone() {
    state.playing = false;
    state.paused  = false;
    setStatus('Done ✓');
    document.getElementById('lf-btn')?.classList.remove('lf-active');
    setTimeout(hidePlayer, 2500);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  UI HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  function onBtnClick() {
    // Second click stops playback
    if (state.playing) {
      stopSpeech(true);
      document.getElementById('lf-btn')?.classList.remove('lf-active');
      return;
    }

    const btn = document.getElementById('lf-btn');
    btn.classList.add('lf-loading');
    showPlayer();
    setStatus('Detecting content…');

    // Defer so the loading animation renders before we do DOM work
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const text = detectContent();
        btn.classList.remove('lf-loading');
        btn.classList.add('lf-active');
        speakText(text);
      });
    });
  }

  function showPlayer() {
    document.getElementById('lf-player')?.classList.add('lf-visible');
  }
  function hidePlayer() {
    document.getElementById('lf-player')?.classList.remove('lf-visible');
  }
  function setStatus(msg) {
    const el = document.getElementById('lf-status');
    if (el) el.textContent = msg;
  }
  function updatePauseBtn() {
    const btn = document.getElementById('lf-pause');
    if (btn) btn.textContent = state.paused ? '▶' : '⏸';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUI);
  } else {
    injectUI();
  }

})();
