document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar scroll state
  const nav = document.getElementById('navbar');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Close mobile menu when a link is clicked
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // 2. Scroll reveal animations
  const revealTargets = document.querySelectorAll(
    '.service-card, .why-item, .step, .review-card, .gallery-item, .zone-tag, .info-box, .sidebar-cta'
  );
  if ('IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min((i % 6) * 55, 250)}ms`;
      observer.observe(el);
    });
  }

  // 3. Gallery category filters (realisations.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-cat]');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = cat === 'all' || item.dataset.cat === cat;
          item.classList.toggle('hidden', !match);
          if (match) item.classList.add('visible');
        });
      });
    });
  }

  // 4. Lightbox for gallery & service photos
  const zoomableImgs = Array.from(document.querySelectorAll('.gallery-item img, .service-img, .service-img-duo img, .service-gallery img'));
  if (zoomableImgs.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Précédent">&#8249;</button>
      <div class="lightbox-content">
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
      <button class="lightbox-nav lightbox-next" aria-label="Suivant">&#8250;</button>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbCap = lb.querySelector('.lightbox-caption');
    const btnClose = lb.querySelector('.lightbox-close');
    const btnPrev = lb.querySelector('.lightbox-prev');
    const btnNext = lb.querySelector('.lightbox-next');

    let currentList = [];
    let currentIdx = 0;

    const getVisibleImgs = () => zoomableImgs.filter(img => !img.closest('.hidden'));

    const showImage = (idx) => {
      if (!currentList.length) return;
      currentIdx = (idx + currentList.length) % currentList.length;
      const img = currentList[currentIdx];
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      const label = img.closest('.gallery-item')?.querySelector('.gallery-label strong')?.textContent;
      lbCap.textContent = label || img.alt || '';
      const showNav = currentList.length > 1;
      btnPrev.style.display = showNav ? 'flex' : 'none';
      btnNext.style.display = showNav ? 'flex' : 'none';
    };

    const openLightbox = (img) => {
      currentList = getVisibleImgs();
      const idx = currentList.indexOf(img);
      showImage(idx >= 0 ? idx : 0);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    };

    zoomableImgs.forEach(img => {
      const clickTarget = img.closest('.gallery-item') || img;
      clickTarget.addEventListener('click', () => openLightbox(img));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIdx - 1); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIdx + 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
      if (e.key === 'ArrowRight') showImage(currentIdx + 1);
    });
  }
});

function submitForm(btn) {
  btn.textContent = '✓ Demande envoyée – Réponse sous 24h !';
  btn.style.background = '#3D6B4A';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Envoyer ma demande de devis →';
    btn.style.background = '';
    btn.style.color = '';
  }, 5000);
}
