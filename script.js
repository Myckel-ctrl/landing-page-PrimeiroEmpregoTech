document.addEventListener('DOMContentLoaded', function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header scroll */
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if(window.scrollY > 30){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* mobile nav */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileNav.classList.remove('open'); });
    });
  }

  /* reveal on scroll (atualizado com os cards de feedback) */
  var revealTargets = document.querySelectorAll('.pain-step, .pain-solution-banner, .product-card, .feedback-card');
  if(reduced || !('IntersectionObserver' in window)){
    revealTargets.forEach(function(el){ el.classList.add('reveal'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.05});
    revealTargets.forEach(function(el){ io.observe(el); });
  }

  /* video modal */
  var videoModal = document.getElementById('videoModal');
  var openModalBtn = document.getElementById('openVideoModal');
  var closeModalBtn = document.getElementById('closeVideoModal');

  if(openModalBtn && videoModal){
    openModalBtn.addEventListener('click', function(){
      videoModal.classList.add('open');
    });
  }
  if(closeModalBtn && videoModal){
    closeModalBtn.addEventListener('click', function(){
      videoModal.classList.remove('open');
    });
  }
  if(videoModal){
    videoModal.addEventListener('click', function(e){
      if(e.target === videoModal){ videoModal.classList.remove('open'); }
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && videoModal){ videoModal.classList.remove('open'); }
  });

  /* faq accordion */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(q && a){
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function(other){
          other.classList.remove('open');
          var otherA = other.querySelector('.faq-a');
          if(otherA) otherA.style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    }
  });

  /* CONTROLE DAS BOLINHAS DOS PRODUTOS (CARROSSEL) */
  var productGrid = document.querySelector('.product-grid');
  var productCards = document.querySelectorAll('.product-card');
  var productDotsWrap = document.getElementById('productDots');

  if (productGrid && productDotsWrap && productCards.length > 0) {
    productCards.forEach(function(_, index) {
      var dot = document.createElement('button');
      dot.className = 'product-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para o card ' + (index + 1));
      
      dot.addEventListener('click', function() {
        productCards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });

      productDotsWrap.appendChild(dot);
    });

    var productDots = productDotsWrap.querySelectorAll('.product-dot');

    var productObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var cardIndex = Array.from(productCards).indexOf(entry.target);
          if (cardIndex !== -1) {
            productDots.forEach(function(dot, i) {
              dot.classList.toggle('active', i === cardIndex);
            });
          }
        }
      });
    }, {
      root: productGrid,
      threshold: 0.6
    });

    productCards.forEach(function(card) {
      productObserver.observe(card);
    });
  }

  /* BOTÕES DE NAVEGAÇÃO DOS PRODUTOS NO COMPUTADOR */
  var btnPrev = document.getElementById('prodPrev');
  var btnNext = document.getElementById('prodNext');

  if (btnPrev && btnNext && productGrid) {
    btnNext.addEventListener('click', function() {
      productGrid.scrollBy({ left: 342, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', function() {
      productGrid.scrollBy({ left: -342, behavior: 'smooth' });
    });
  }

  /* CONTROLE DO CARROSSEL DE FEEDBACK (PADRÃO PRODUTO) */
  var feedGrid = document.querySelector('.feedback-grid');
  var feedCards = document.querySelectorAll('.feedback-card');
  var feedDotsWrap = document.getElementById('feedDots');
  var btnFeedPrev = document.getElementById('feedPrev');
  var btnFeedNext = document.getElementById('feedNext');

  if (btnFeedPrev && btnFeedNext && feedGrid) {
    btnFeedNext.addEventListener('click', function() {
      feedGrid.scrollBy({ left: 340, behavior: 'smooth' });
    });

    btnFeedPrev.addEventListener('click', function() {
      feedGrid.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }

  if (feedGrid && feedDotsWrap && feedCards.length > 0) {
    feedCards.forEach(function(_, index) {
      var dot = document.createElement('button');
      dot.className = 'product-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para o depoimento ' + (index + 1));

      dot.addEventListener('click', function() {
        feedCards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      });

      feedDotsWrap.appendChild(dot);
    });

    var feedDots = feedDotsWrap.querySelectorAll('.product-dot');

    var feedObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var cardIndex = Array.from(feedCards).indexOf(entry.target);
          if (cardIndex !== -1) {
            feedDots.forEach(function(dot, i) {
              dot.classList.toggle('active', i === cardIndex);
            });
          }
        }
      });
    }, {
      root: feedGrid,
      threshold: 0.6
    });

    feedCards.forEach(function(card) {
      feedObserver.observe(card);
    });
  }

});