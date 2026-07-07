/* ==========================================================================
   Little Scholars Academy - Redesign Interaction Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header Scroll Effect
  const header = document.getElementById('header');
  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navbar = document.querySelector('.navbar');

  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      mobileToggle.classList.toggle('bi-list');
      mobileToggle.classList.toggle('bi-x');
    });
  }

  // 3. Mobile Dropdown Sub-menu expand (touch screen fixes)
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
        
        dropdowns.forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
      }
    });
  });

  // 4. Scroll Reveal Animations Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. Dynamic Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseInt(target.getAttribute('data-target'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          animateCounter(target, targetVal, suffix);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.8 });

    statNumbers.forEach(num => counterObserver.observe(num));
  } else {
    // Fallback: show static numbers immediately
    statNumbers.forEach(num => {
      const val = num.getAttribute('data-target');
      const suffix = num.getAttribute('data-suffix') || '';
      num.textContent = val + suffix;
    });
  }

  const animateCounter = (element, targetValue, suffix) => {
    let start = 0;
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * targetValue);
      
      element.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = targetValue + suffix;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // 6. Asymmetric Collage Hero Shifting Images (Auto loop)
  const collageItems = document.querySelectorAll('.hero-collage .collage-item img');
  const heroImageUrls = [
    'https://lsamalsi.in/assets/img/Carousel/photo_2023-02-10_23-32-36.jpg',
    'https://lsamalsi.in/assets/img/Carousel/photo_2023-02-10_23-32-12.jpg',
    'https://lsamalsi.in/assets/img/Carousel/photo_2023-02-10_23-31-53.jpg',
    'https://lsamalsi.in/assets/img/Carousel/photo_2023-02-10_23-32-21.jpg',
    'https://lsamalsi.in/assets/img/Carousel/photo_2023-02-10_23-32-29.jpg'
  ];

  if (collageItems.length >= 2) {
    let imgIndex = 0;
    setInterval(() => {
      // Transition secondary images with primary
      imgIndex = (imgIndex + 1) % heroImageUrls.length;
      
      // Select main and sub pictures to update
      const mainImg = collageItems[0];
      const subImg = collageItems[1];

      // Fade out
      mainImg.style.opacity = '0.5';
      subImg.style.opacity = '0.5';
      
      setTimeout(() => {
        mainImg.src = heroImageUrls[imgIndex];
        subImg.src = heroImageUrls[(imgIndex + 1) % heroImageUrls.length];
        
        mainImg.style.opacity = '1';
        subImg.style.opacity = '1';
      }, 450);

    }, 7000);
  }

  // 7. Expandable Facilities Cards Toggles
  const readMoreBtns = document.querySelectorAll('.btn-read-more');
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.facility-card');
      const moreDesc = card.querySelector('.more-description');
      
      if (moreDesc) {
        const isShown = moreDesc.classList.contains('show');
        
        // Toggle the target card description
        moreDesc.classList.toggle('show');
        btn.classList.toggle('active');
        btn.textContent = isShown ? 'Read More' : 'Read Less';
      }
    });
  });

  // 8. Custom Lightbox Modal (gallery.html)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let activeItems = [];
  let currentIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    
    const updateActiveItems = () => {
      activeItems = Array.from(galleryItems).filter(item => {
        // filter elements currently visible in layout
        return getComputedStyle(item).display !== 'none';
      });
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        updateActiveItems();
        currentIndex = activeItems.indexOf(item);
        
        openLightbox();
        updateLightboxContent();
      });
    });

    const openLightbox = () => {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const updateLightboxContent = () => {
      if (activeItems[currentIndex]) {
        const img = activeItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || 'Little Scholars Academy Campus Highlight';
      }
    };

    const nextImage = () => {
      currentIndex = (currentIndex + 1) % activeItems.length;
      updateLightboxContent();
    };

    const prevImage = () => {
      currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
      updateLightboxContent();
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 9. Gallery Tabbed Filter
  const filterBtns = document.querySelectorAll('.gallery-btn');
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Clear active class from buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filterValue === '*' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 350);
          }
        });
      });
    });
  }

  // 10. Admission Pop-up Modal Ad (Session bound)
  const popupWrapper = document.querySelector('.popup-wrapper');
  const popupClose = document.querySelector('.popup-close');

  if (popupWrapper) {
    const isAdClosed = sessionStorage.getItem('lsa_premium_popup_closed');
    if (!isAdClosed) {
      setTimeout(() => {
        popupWrapper.classList.add('active');
      }, 1500);
    }

    if (popupClose) {
      popupClose.addEventListener('click', () => {
        popupWrapper.classList.remove('active');
        sessionStorage.setItem('lsa_premium_popup_closed', 'true');
      });
    }

    popupWrapper.addEventListener('click', (e) => {
      if (e.target === popupWrapper) {
        popupWrapper.classList.remove('active');
        sessionStorage.setItem('lsa_premium_popup_closed', 'true');
      }
    });
  }

  // 11. Contact Form Simulation Alert
  const contactForm = document.querySelector('.php-email-form');
  const contactStatus = document.getElementById('contact-status');

  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending Enquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactStatus.textContent = 'Thank you! Your message has been received. Our administration office will get back to you shortly.';
        contactStatus.className = 'contact-status success';
        contactForm.reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
          contactStatus.style.display = 'none';
        }, 6000);
      }, 1200);
    });
  }

  // 12. Floating Admissions Badge scroll behavior
  const floatingBadge = document.querySelector('.floating-badge');
  const backToTopBtn = document.querySelector('.back-to-top');

  if (floatingBadge || backToTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      
      if (backToTopBtn) {
        if (scrollPos > 400) {
          backToTopBtn.classList.add('active');
        } else {
          backToTopBtn.classList.remove('active');
        }
      }

      if (floatingBadge) {
        if (scrollPos > 120) {
          floatingBadge.style.transform = 'scale(1) translateY(0)';
          floatingBadge.style.opacity = '1';
        } else {
          // Keep it semi-visible on entry header area
          floatingBadge.style.transform = 'scale(0.9) translateY(0)';
        }
      }
    });
  }
});
