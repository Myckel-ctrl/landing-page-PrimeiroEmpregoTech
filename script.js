// =========================================================
// PRIMEIRO EMPREGO TECH — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Carrossel genérico (produtos e depoimentos) ---------- */
  // prevId e nextId são opcionais: o carrossel de produtos não tem setas,
  // só dots e scroll manual. O de depoimentos tem os dois.
  function initCarousel(config) {
    var track = document.querySelector(config.track);
    var dotsWrap = document.getElementById(config.dotsId);

    if (!track || !dotsWrap) return;

    var prevBtn = config.prevId ? document.getElementById(config.prevId) : null;
    var nextBtn = config.nextId ? document.getElementById(config.nextId) : null;

    var items = Array.prototype.slice.call(track.children);
    if (!items.length) return;

    // gera os dots
    items.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Ir para o item ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        scrollToIndex(i);
      });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToIndex(i);
        }
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function itemWidth() {
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || 0);
      // Usamos offsetWidth para pegar a largura real do elemento renderizado
      return items[0].offsetWidth + gap;
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / itemWidth());
    }

    function updateDots() {
      var idx = Math.min(currentIndex(), dots.length - 1);
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });
    }

    function scrollToIndex(i) {
      var clamped = Math.max(0, Math.min(i, items.length - 1));
      track.scrollTo({
        left: clamped * itemWidth(),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        scrollToIndex(currentIndex() - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        scrollToIndex(currentIndex() + 1);
      });
    }

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateDots);
    });
  }



  // carrossel de produtos (livros)
  initCarousel({
    track: '.product-grid',
    prevId: 'prodPrev',
    nextId: 'prodNext',
    dotsId: 'prodDots'
  });

  // carrossel de depoimentos
  initCarousel({
    track: '.feedback-grid',
    prevId: 'feedPrev',
    nextId: 'feedNext',
    dotsId: 'feedDots'
  });

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    var inner = item.querySelector('.faq-a-inner');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // fecha os outros itens abertos (garante só um aberto por vez)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contador de urgência ---------- */
  // Atualiza TODOS os elementos com a classe .js-countdown ao mesmo tempo,
  // para que o cronômetro do banner e o de dentro da oferta fiquem sempre
  // sincronizados, mostrando o mesmo tempo restante. Persiste no
  // localStorage para não ser um "falso" contador que reinicia sozinho
  // a cada recarregamento da página.
  var countdownEls = document.querySelectorAll('.js-countdown');

  if (countdownEls.length) {
    var STORAGE_KEY = 'primeiro_emprego_timer';
    var DURATION = 15 * 60; // 15 minutos

    function getInitialTimer() {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var diff = Math.floor((Date.now() - parseInt(saved, 10)) / 1000);
        if (diff >= 0 && diff < DURATION) return DURATION - diff;
      }
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      return DURATION;
    }

    var timer = getInitialTimer();

    function tick() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;
      var formatted = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

      countdownEls.forEach(function (el) {
        el.textContent = formatted;
      });

      if (timer > 0) {
        timer--;
      } else {
        // Reinicia o timer ao chegar em zero
        timer = DURATION;
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Animações de Scroll Reveal ---------- */
  // Depois que o elemento aparece, paramos de observá-lo (unobserve).
  // Sem isso, o observer continua rodando pra sempre em TODO elemento .reveal
  // da página (dezenas deles), o que pesa a rolagem e atrasa a percepção
  // de carregamento das imagens que vêm logo depois na página.
  // Se a pessoa pediu "reduzir movimento" no sistema, mostramos tudo
  // direto, sem observer e sem animação de entrada.
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    if (prefersReducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add('active');
      });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      reveals.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- Vídeo do hero (toca só quando a pessoa clica) ---------- */
  // Só existe se a página tiver #heroVideo com data-video-src (o vídeo
  // foi retirado temporariamente do HTML, então este bloco fica inativo
  // até ele voltar, sem gerar erro).
  var heroVideo = document.getElementById('heroVideo');
  var heroVideoPlay = document.getElementById('heroVideoPlay');

  if (heroVideo && heroVideoPlay) {
    heroVideo.addEventListener('click', function () {
      var src = heroVideo.getAttribute('data-video-src');
      if (!src) return;

      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'none';

      heroVideo.innerHTML = '';
      heroVideo.appendChild(video);
      heroVideo.style.cursor = 'default';
    });
  }

  /* ---------- Meta Pixel: evento de início de checkout ---------- */
  // Dispara quando a pessoa clica em qualquer botão de compra (.buy-btn).
  // Só executa se o Pixel estiver carregado (fbq definido), então não dá
  // erro caso o script do Pixel seja bloqueado ou ainda não tenha ID real.
  var buyButtons = document.querySelectorAll('.buy-btn');

  if (buyButtons.length) {
    buyButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout');
        }
      });
    });
  }

});