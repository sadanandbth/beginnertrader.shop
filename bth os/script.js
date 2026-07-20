document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================
     0. DUAL THEME MODE (LIGHT / DARK)
     ================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
  if (themeToggleBtn) {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }
    
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      if (themeIcon) {
        themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });
  }


  /* ==================================================
     1. TABS SYSTEM (SOFTWARE SHOWCASE)
     ================================================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const appWindowTitle = document.getElementById('appWindowTabTitle');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons and panels
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      // Add active to clicked button
      btn.classList.add('active');
      
      // Activate matching panel
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Update app window header title
      if (appWindowTitle) {
        appWindowTitle.textContent = btn.textContent.trim();
      }
    });
  });

  /* ==================================================
     2. MOUSE TRACKING GLOW EFFECT (CARD HIGHLIGHTS)
     ================================================== */
  const glowCards = document.querySelectorAll('.feature-card');
  
  glowCards.forEach(card => {
    let rafId;
    card.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      });
    });
    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
    });
  });

  /* ==================================================
     3. REVEAL ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
     ================================================== */
  const revealElements = document.querySelectorAll('.reveal-el, .section-header, .tabs-container, .comparison-wrapper, .roadmap-timeline, .faq-container, .gallery-grid, .download-layout, .cta-box');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==================================================
     4. ANIMATED COUNTERS (STATS SECTION)
     ================================================== */
  const statItems = document.querySelectorAll('.stat-item');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * target);
      
      // Format number representation
      if (el.id === 'statVal1') {
        // Target: 392000 -> output: 392K+
        const valDiv = Math.floor(currentValue / 1000);
        el.textContent = `${valDiv}K+`;
      } else if (el.id === 'statVal2') {
        // Target: 5 -> output: 5+
        el.textContent = `${currentValue}+`;
      } else if (el.id === 'statVal3') {
        // Target: 10000 -> output: 10000+
        el.textContent = `${currentValue}+`;
      } else if (el.id === 'statVal4') {
        // Target: 98 -> output: 98%
        el.textContent = `${currentValue}%`;
      } else {
        el.textContent = currentValue;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl) {
          animateCounter(numEl);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  statItems.forEach(item => {
    statsObserver.observe(item);
  });

  /* ==================================================
     5. LIGHTBOX PREVIEW (IMAGE GALLERY)
     ================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  
  // Array of image paths mapped to data-img-idx
  const images = [
    "https://bthalgo.com/images/bth%20os%20dashboard.png", // 0
    "https://bthalgo.com/images/bth%20os%20analytics.png", // 1
    "https://bthalgo.com/images/bth%20os%20trade%20history.png", // 2
    "https://bthalgo.com/images/bth%20os%20journal.png", // 3
    "https://bthalgo.com/images/bth%20os%20about.png", // 4
    "https://bthalgo.com/images/bth%20os%20calcu%20compounding.png", // 5
    "https://bthalgo.com/images/bth%20os%20calcu%20daily%20breakdown.png", // 6
    "https://bthalgo.com/images/bth%20os%20calu%20trading%20simulator.png" // 7
  ];
  
  const captions = [
    { title: "Live Workspace Dashboard", desc: "A comprehensive trading cockpit displaying real-time execution statistics, profit targets, open orders, and quick access components." },
    { title: "Advanced Trade Analytics", desc: "Interactive charts detailing strategy outcome distribution, win rates, drawdown parameters, and long-term equity growth curves." },
    { title: "Trade History Registry", desc: "Detailed timeline mapping past positions, execution times, transaction pricing, lot sizing, and risk ratios." },
    { title: "Local Trading Journal Editor", desc: "A offline editor canvas built to record psychological variables, screenshots, rules adherence trackers, and session summaries." },
    { title: "System Info About Screen", desc: "Application system details showcasing BTH OS client version data, active licensing nodes, and database settings." },
    { title: "Compounding Calculator", desc: "Calculate compounding growth charts based on user-defined capital reserves, expected returns, and target daily rates." },
    { title: "Daily Breakdown Calculator", desc: "Define monthly earnings objectives and break them down into target daily performance steps with safety limit triggers." },
    { title: "Trading Simulator", desc: "Input strategy performance ratios and run mock sequences to trace mathematical expectancy and variance spreads." }
  ];
  
  let currentImgIdx = 0;
  
  const openLightbox = (index) => {
    currentImgIdx = parseInt(index, 10);
    if (isNaN(currentImgIdx) || currentImgIdx < 0 || currentImgIdx >= images.length) return;
    
    lightboxImg.src = images[currentImgIdx];
    lightboxTitle.textContent = captions[currentImgIdx].title;
    lightboxDesc.textContent = captions[currentImgIdx].desc;
    
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock page scroll
  };
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock page scroll
  };
  
  const showPrevImg = () => {
    currentImgIdx = (currentImgIdx - 1 + images.length) % images.length;
    openLightbox(currentImgIdx);
  };
  
  const showNextImg = () => {
    currentImgIdx = (currentImgIdx + 1) % images.length;
    openLightbox(currentImgIdx);
  };
  
  // Attach click listener to any clickable image showcase container
  const clickPreviews = document.querySelectorAll('[data-img-idx], .gallery-item, .calc-img-wrapper, .showcase-image-wrapper');
  clickPreviews.forEach(el => {
    el.addEventListener('click', (e) => {
      // Find data-img-idx attribute upwards
      const container = e.target.closest('[data-img-idx]');
      if (container) {
        const idx = container.getAttribute('data-img-idx');
        openLightbox(idx);
      }
    });
  });
  
  // Close / Nav event listeners
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImg);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImg);
  
  // Close when clicking outside content box
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard triggers
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevImg();
    } else if (e.key === 'ArrowRight') {
      showNextImg();
    }
  });

  /* ==================================================
     6. CONSOLIDATED SCROLL PERFORMANCE HANDLER
     ================================================== */
  const floatingBanner = document.getElementById('floatingDownloadBanner');
  const header = document.getElementById('siteHeader');
  let bannerTriggered = false;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        
        // 1. Header transparency toggle
        if (scrollTop > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        
        // 2. Floating download banner visibility
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const scrollPercent = scrollTop / docHeight;
          if (scrollPercent >= 0.40) {
            if (!bannerTriggered) {
              floatingBanner.classList.add('visible');
              bannerTriggered = true;
            }
          } else {
            if (bannerTriggered) {
              floatingBanner.classList.remove('visible');
              bannerTriggered = false;
            }
          }
        }
        
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ==================================================
     9. MOBILE NAVIGATION HAMBURGER DRAWER
     ================================================== */
  const hamburger = document.getElementById('hamburgerMenu');
  const navMenu = document.getElementById('navMenu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const active = navMenu.classList.toggle('mobile-active');
      const icon = hamburger.querySelector('i');
      
      if (active) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = 'var(--header-height)';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(5, 5, 5, 0.98)';
        navMenu.style.borderBottom = '1px solid var(--border-color)';
        navMenu.style.padding = '24px';
        navMenu.style.gap = '20px';
        navMenu.style.zIndex = '999';
        if (icon) icon.className = 'fa-solid fa-xmark';
      } else {
        navMenu.style.display = '';
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
    
    // Close mobile menu on nav link click
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('mobile-active')) {
          navMenu.classList.remove('mobile-active');
          navMenu.style.display = '';
          const icon = hamburger.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }

});
