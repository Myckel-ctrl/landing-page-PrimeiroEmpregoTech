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
  // Atualiza TODOS os elementos com a classe .js-countdown ao mesmo tempo,
  // para que o cronômetro do banner e o de dentro da oferta fiquem sempre
  // sincronizados, mostrando o mesmo tempo restante.
  var countdownEls = document.querySelectorAll('.js-countdown');

  if (countdownEls.length) {
    var timer = 15 * 60; // 15 minutos

    function tick() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;
      var formatted =
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

      countdownEls.forEach(function (el) {
        el.textContent = formatted;
      });

      if (timer > 0) {
        timer--;
      } else {
        timer = 15 * 60;
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Vídeo do hero (toca só quando a pessoa clica) ---------- */
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

      heroVideo.innerHTML = '';
      heroVideo.appendChild(video);
      heroVideo.style.cursor = 'default';
    });
  }

  /* ---------- CTA fixo ao rolar a página ---------- */
  // Aparece depois da hero e SOME na oferta, garantia, faq, final-cta e footer
  var stickyCta = document.getElementById('stickyCta');
  var heroSection = document.getElementById('top');

  // Lista de seletores onde o CTA FIXO NÃO deve aparecer
  var hiddenSections = document.querySelectorAll('#oferta, #garantia, #faq, .final-cta, footer');

  if (stickyCta && heroSection) {
    var pastHero = false;
    var isOverHiddenSection = false;

    function updateStickyCta() {
      // Exibe apenas se já passou da Hero E NÃO está em nenhuma seção proibida
      if (pastHero && !isOverHiddenSection) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    }

    // Monitora a Hero
    var heroObserver = new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      updateStickyCta();
    }, { threshold: 0.2 });

    heroObserver.observe(heroSection);

    // Monitora todas as seções onde o CTA deve sumir
    var hiddenObserver = new IntersectionObserver(function (entries) {
      // Verifica se pelo menos uma das seções está visível na tela
      var anyVisible = Array.from(hiddenSections).some(function (sec) {
        var rect = sec.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });

      isOverHiddenSection = anyVisible;
      updateStickyCta();
    }, { threshold: 0.05 });

    hiddenSections.forEach(function (section) {
      hiddenObserver.observe(section);
    });
  }

});