// Main JavaScript functionality
class HubPessoal {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoading();
    this.setupBackToTop();
    this.setupAnimations();
    this.setupNewsletterForm();
    this.setupAnalytics();
    this.setupAccessibility();
  }

  // Loading animation
  setupLoading() {
    window.addEventListener('load', () => {
      const loading = document.getElementById('loading');
      if (loading) {
        setTimeout(() => {
          loading.classList.add('hidden');
          setTimeout(() => {
            loading.remove();
          }, 300);
        }, 500);
      }
    });
  }

  // Back to top functionality
  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Event listeners
    window.addEventListener('scroll', this.throttle(toggleBackToTop, 100));
    backToTopBtn.addEventListener('click', scrollToTop);
  }

  // Scroll animations
  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.link-button, .quick-action, .video-section, .newsletter-section');
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Newsletter form handling
  setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = form.querySelector('input[type="email"]').value;
      const button = form.querySelector('.btn-newsletter');
      const originalText = button.innerHTML;

      // Validate email
      if (!this.isValidEmail(email)) {
        this.showNotification('Por favor, insira um email válido.', 'error');
        return;
      }

      // Show loading state
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscrevendo...';
      button.disabled = true;

      // Simulate API call (replace with actual implementation)
      setTimeout(() => {
        // Success simulation
        this.showNotification('Inscrição realizada com sucesso! 🎉', 'success');
        form.reset();
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;

        // Track event
        this.trackEvent('newsletter_signup', { email: email });
      }, 2000);
    });
  }

  // Analytics tracking
  setupAnalytics() {
    // Track link clicks
    document.querySelectorAll('.link-button, .quick-action').forEach(link => {
      link.addEventListener('click', (e) => {
        const linkText = link.textContent.trim();
        const linkUrl = link.href;
        
        this.trackEvent('external_link_click', {
          link_text: linkText,
          link_url: linkUrl
        });
      });
    });

    // Track video engagement
    const videoIframe = document.querySelector('.video-container iframe');
    if (videoIframe) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.trackEvent('video_view', {
              video_title: 'VOCÊ TEM SORTE'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(videoIframe);
    }
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Keyboard navigation for custom elements
    document.querySelectorAll('.link-button, .quick-action').forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Fechar notificação">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success-500)' : type === 'error' ? 'var(--error-500)' : 'var(--primary-500)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      z-index: var(--z-tooltip);
      transform: translateX(100%);
      transition: transform var(--transition-normal);
      max-width: 300px;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', closeNotification);

    // Auto close after 5 seconds
    setTimeout(closeNotification, 5000);
  }

  trackEvent(eventName, parameters = {}) {
    // Google Analytics 4 tracking (replace with your implementation)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }

    // Console log for development
    console.log('Event tracked:', eventName, parameters);
  }
}

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      console.log('FID:', entry.processingStart - entry.startTime);
    }
  });
});

performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HubPessoal();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}