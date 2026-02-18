/**
 * Presentation Navigation System
 * Handles page transitions, keyboard navigation, and indicators
 */

class Presentation {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.isAnimating = false;
        this.animationDuration = 600;
        this.hideTimeout = null;
        this.hideDelay = 2000; // 2 seconds

        // Define available transition effects
        this.transitions = [
            // Horizontal slide
            { outClass: 'pt-page-moveToLeft', inClass: 'pt-page-moveFromRight' },
            { outClass: 'pt-page-moveToRight', inClass: 'pt-page-moveFromLeft' },
            // Vertical slide
            { outClass: 'pt-page-moveToTop', inClass: 'pt-page-moveFromBottom' },
            { outClass: 'pt-page-moveToBottom', inClass: 'pt-page-moveFromTop' },
            // Fade
            { outClass: 'pt-page-fade', inClass: 'pt-page-moveFromFade' },
        ];

        this.init();
    }

    init() {
        // Find all slide pages
        this.slides = document.querySelectorAll('.pt-page');
        
        console.log(`Found ${this.slides.length} slides`);

        // Remove any existing navigation to prevent duplicates
        const existingNav = document.querySelector('.slide-nav');
        if (existingNav) {
            existingNav.remove();
        }

        // Set first slide as current, remove current class from others
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('pt-page-current');
            } else {
                slide.classList.remove('pt-page-current');
            }
        });

        // Create navigation controls
        this.createNavigation();

        // Create page indicators
        this.createIndicators();

        // Bind keyboard events
        this.bindKeyboardEvents();

        // Bind touch events for mobile
        this.bindTouchEvents();

        // Bind mouse events for nav visibility
        this.bindMouseEvents();

        // Update navigation state
        this.updateNavigation();

        // Handle window resize for scaling
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());

        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
    }

    createNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'slide-nav visible';
        nav.innerHTML = `
            <button class="nav-btn prev-btn" aria-label="Previous slide">
                <i class="fas fa-chevron-left"></i>
                <span>Previous</span>
            </button>
            
            <div class="page-indicators"></div>
            
            <div class="slide-counter">
                <span class="current-num">1</span> / <span class="total-num">${this.slides.length}</span>
            </div>
            
            <button class="fullscreen-btn" aria-label="Toggle fullscreen">
                <i class="fas fa-expand"></i>
            </button>
            
            <button class="nav-btn next-btn" aria-label="Next slide">
                <span>Next</span>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        document.querySelector('.slide-container').appendChild(nav);

        // Bind click events
        nav.querySelector('.prev-btn').addEventListener('click', () => this.prevSlide());
        nav.querySelector('.next-btn').addEventListener('click', () => this.nextSlide());
        nav.querySelector('.fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
    }

    createIndicators() {
        const indicatorsContainer = document.querySelector('.page-indicators');

        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator' + (i === 0 ? ' active' : '');
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }

    bindTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;

            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            // Minimum swipe distance of 50px
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }

    bindMouseEvents() {
        const nav = document.querySelector('.slide-nav');

        // Show nav on mouse move
        document.addEventListener('mousemove', () => {
            this.showNavigation();
            this.resetHideTimer();
        });

        // Keep nav visible when hovering over it
        nav.addEventListener('mouseenter', () => {
            this.showNavigation();
            clearTimeout(this.hideTimeout);
        });

        // Start hide timer when leaving nav
        nav.addEventListener('mouseleave', () => {
            this.resetHideTimer();
        });

        // Start initial hide timer
        this.resetHideTimer();
    }

    showNavigation() {
        const nav = document.querySelector('.slide-nav');
        if (nav) {
            nav.classList.remove('hidden');
            nav.classList.add('visible');
        }
    }

    hideNavigation() {
        const nav = document.querySelector('.slide-nav');
        if (nav) {
            nav.classList.remove('visible');
            nav.classList.add('hidden');
        }
    }

    resetHideTimer() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
            this.hideNavigation();
        }, this.hideDelay);
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1, 'next');
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1, 'prev');
        }
    }

    goToSlide(index, direction = null) {
        if (this.isAnimating || index === this.currentSlide) return;
        if (index < 0 || index >= this.slides.length) return;

        this.isAnimating = true;

        const current = this.slides[this.currentSlide];
        const next = this.slides[index];

        // Select a random transition effect
        const transition = this.transitions[Math.floor(Math.random() * this.transitions.length)];

        // Apply random transition classes
        current.classList.add(transition.outClass);
        next.classList.add(transition.inClass);

        next.classList.add('pt-page-current', 'pt-page-ontop');

        // Clean up after animation
        setTimeout(() => {
            // Remove all possible transition classes from current
            this.transitions.forEach(t => {
                current.classList.remove(t.outClass);
            });

            // Remove all possible transition classes from next
            this.transitions.forEach(t => {
                next.classList.remove(t.inClass);
            });

            current.classList.remove('pt-page-current', 'pt-page-ontop');
            next.classList.remove('pt-page-ontop');

            this.currentSlide = index;
            this.isAnimating = false;
            this.updateNavigation();
        }, this.animationDuration);
    }

    updateNavigation() {
        // Update buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.slides.length - 1;

        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentSlide);
        });

        // Update counter
        const currentNum = document.querySelector('.current-num');
        if (currentNum) {
            currentNum.textContent = this.currentSlide + 1;
        }
    }

    handleResize() {
        // The CSS handles scaling via media queries
        // This can be extended for additional resize logic
    }

    toggleFullscreen() {
        const btn = document.querySelector('.fullscreen-btn i');

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                if (btn) {
                    btn.classList.remove('fa-expand');
                    btn.classList.add('fa-compress');
                }
            }).catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                if (btn) {
                    btn.classList.remove('fa-compress');
                    btn.classList.add('fa-expand');
                }
            });
        }
    }

    updateFullscreenButton() {
        const btn = document.querySelector('.fullscreen-btn i');
        if (btn) {
            if (document.fullscreenElement) {
                btn.classList.remove('fa-expand');
                btn.classList.add('fa-compress');
            } else {
                btn.classList.remove('fa-compress');
                btn.classList.add('fa-expand');
            }
        }
    }
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize once
    if (!window.presentation) {
        window.presentation = new Presentation();
    }
});
