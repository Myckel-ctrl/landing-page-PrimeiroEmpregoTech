// =========================================================
// PRIMEIRO EMPREGO TECH — script.js
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

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
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        scrollToIndex(i);
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function itemWidth() {
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || 0);
      return items[0].getBoundingClientRect().width + gap;
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
      track.scrollTo({ left: clamped * itemWidth(), behavior: 'smooth' });
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

  // carrossel de produtos: sem setas, só dots e scroll manual
  initCarousel({
    track: '.product-grid',
    dotsId: 'productDots'
  });

  // carrossel de depoimentos: com setas
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

      // fecha os outros itens abertos
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Contador de urgência (reinicia a cada carregamento) ---------- */
  var countdownEl = document.getElementById('countdown');

  if (countdownEl) {
    var timer = 15 * 60; // 15 minutos

    function tick() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;
      countdownEl.textContent =
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

      if (timer > 0) {
        timer--;
      } else {
        timer = 15 * 60;
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- CTA fixo ao rolar a página ---------- */
  // Aparece depois que a pessoa passa da hero.
  // Some quando a seção de oferta está visível, já que ali tem os próprios CTAs.
  var stickyCta = document.getElementById('stickyCta');
  var heroSection = document.getElementById('top');
  var offerSection = document.getElementById('oferta');

  if (stickyCta && heroSection && offerSection) {
    var pastHero = false;
    var insideOffer = false;

    function updateStickyCta() {
      if (pastHero && !insideOffer) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }

    var heroObserver = new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      updateStickyCta();
    }, { threshold: 0 });

    var offerObserver = new IntersectionObserver(function (entries) {
      insideOffer = entries[0].isIntersecting;
      updateStickyCta();
    }, { threshold: 0.15 });

    heroObserver.observe(heroSection);
    offerObserver.observe(offerSection);
  }

});