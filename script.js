// =========================================================
// PRIMEIRO EMPREGO TECH — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Carrossel genérico (produtos e depoimentos) ---------- */
  function initCarousel({ track, dotsId, prevId, nextId }) {
    const trackEl = document.querySelector(track);
    const dotsWrap = document.getElementById(dotsId);
    if (!trackEl || !dotsWrap) return;

    const items = [...trackEl.children];
    if (!items.length) return;

    const itemWidth = () => {
      const gap = parseFloat(getComputedStyle(trackEl).columnGap || 0);
      return items[0].offsetWidth + gap;
    };

    const goTo = (i) => {
      const clamped = Math.max(0, Math.min(i, items.length - 1));
      trackEl.scrollTo({ left: clamped * itemWidth(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };

    const dots = items.map((_, i) => {
      const dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Ir para o item ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    document.getElementById(prevId)?.addEventListener('click', () => goTo(Math.round(trackEl.scrollLeft / itemWidth()) - 1));
    document.getElementById(nextId)?.addEventListener('click', () => goTo(Math.round(trackEl.scrollLeft / itemWidth()) + 1));

    trackEl.addEventListener('scroll', () => {
      requestAnimationFrame(() => {
        const idx = Math.min(Math.round(trackEl.scrollLeft / itemWidth()), dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      });
    }, { passive: true });
  }

  initCarousel({ track: '.product-grid', dotsId: 'prodDots', prevId: 'prodPrev', nextId: 'prodNext' });
  initCarousel({ track: '.feedback-grid', dotsId: 'feedDots', prevId: 'feedPrev', nextId: 'feedNext' });

  /* ---------- FAQ accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    const inner = item.querySelector('.faq-a-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contador de urgência ---------- */
  const countdownEls = document.querySelectorAll('.js-countdown');

  if (countdownEls.length) {
    const STORAGE_KEY = 'primeiro_emprego_timer';
    const DURATION = 15 * 60;

    const getInitialTimer = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const diff = Math.floor((Date.now() - parseInt(saved, 10)) / 1000);
        if (diff >= 0 && diff < DURATION) return DURATION - diff;
      }
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      return DURATION;
    };

    let timer = getInitialTimer();

    const tick = () => {
      const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
      const seconds = String(timer % 60).padStart(2, '0');
      const formatted = `${minutes}:${seconds}`;
      countdownEls.forEach((el) => { el.textContent = formatted; });

      if (timer > 0) {
        timer--;
      } else {
        timer = DURATION;
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Scroll Reveal ----------
     Descendo → aparece e fica
     Subindo (vindo do final) → some o que sai por baixo
  ------------------------------------ */
  document.querySelectorAll('.faq-item').forEach((el) => el.classList.add('reveal'));

  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else if (entry.boundingClientRect.top > 0) {
          entry.target.classList.remove('active');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Vídeo do hero ---------- */
  const heroVideo = document.getElementById('heroVideo');
  const heroVideoPlay = document.getElementById('heroVideoPlay');

  if (heroVideo && heroVideoPlay) {
    heroVideo.addEventListener('click', () => {
      const src = heroVideo.getAttribute('data-video-src');
      if (!src) return;

      const video = document.createElement('video');
      Object.assign(video, { src, controls: true, autoplay: true, playsInline: true, preload: 'none' });

      heroVideo.innerHTML = '';
      heroVideo.appendChild(video);
      heroVideo.style.cursor = 'default';
    });
  }

  /* ---------- Meta Pixel ---------- */
  document.querySelectorAll('.buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof fbq === 'function') fbq('track', 'InitiateCheckout');
    });
  });

});
