// ===========================================
// MOBILE MENU TOGGLE
// ===========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ===========================================
// SMOOTH SCROLL WITH OFFSET FOR FIXED NAVBAR
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================================
// NAVBAR BACKGROUND ON SCROLL
// ===========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===========================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ===========================================
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

// Observe all feature cards, pricing cards, and use cases
document.querySelectorAll('.feature-card, .pricing-card, .use-case, .contact-card').forEach(el => {
    observer.observe(el);
});

// ===========================================
// PERFORMANCE CHART ANIMATION
// ===========================================
const animateChartBars = () => {
    const bars = document.querySelectorAll('.bar');

    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transition = 'width 1s ease';
                    }, index * 100);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const chart = document.querySelector('.performance-chart');
    if (chart) {
        chartObserver.observe(chart);
    }
};

// Initialize chart animation
animateChartBars();

// ===========================================
// TERMINAL TYPING ANIMATION (Optional Enhancement)
// ===========================================
const terminalTyping = () => {
    const terminalBody = document.querySelector('.terminal-body code');
    if (!terminalBody) return;

    const originalContent = terminalBody.innerHTML;
    terminalBody.innerHTML = '';

    let index = 0;
    const speed = 10; // milliseconds per character

    const type = () => {
        if (index < originalContent.length) {
            terminalBody.innerHTML = originalContent.slice(0, index + 1);
            index++;
            setTimeout(type, speed);
        }
    };

    // Start typing when terminal comes into view
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const terminal = document.querySelector('.terminal-window');
    if (terminal) {
        terminalObserver.observe(terminal);
    }
};

// Uncomment to enable terminal typing animation
// terminalTyping();

// ===========================================
// DYNAMIC STATS COUNTER
// ===========================================
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16); // 60fps

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                // Only animate if it's a pure number
                if (!isNaN(text)) {
                    animateCounter(stat, parseInt(text));
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===========================================
// PRICING TOGGLE (Annual/Monthly) - Optional Enhancement
// ===========================================
// If you want to add annual/monthly toggle, uncomment and use this:
/*
const pricingToggle = () => {
    const toggleBtn = document.getElementById('pricingToggle');
    if (!toggleBtn) return;

    const monthlyPrices = {
        starter: 29,
        pro: 99
    };

    const annualPrices = {
        starter: 290,
        pro: 990
    };

    toggleBtn.addEventListener('change', (e) => {
        const isAnnual = e.target.checked;

        document.querySelectorAll('[data-plan]').forEach(priceEl => {
            const plan = priceEl.dataset.plan;
            const price = isAnnual ? annualPrices[plan] : monthlyPrices[plan];
            const period = isAnnual ? '/year' : '/month';

            priceEl.querySelector('.price').textContent = `$${price}`;
            priceEl.querySelector('.period').textContent = period;
        });
    });
};

pricingToggle();
*/

// ===========================================
// FORM VALIDATION (If you add a contact form)
// ===========================================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===========================================
// COPY TO CLIPBOARD FOR CODE SNIPPETS
// ===========================================
const addCopyButtons = () => {
    const codeBlocks = document.querySelectorAll('.terminal-body code');

    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 102, 204, 0.8);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const container = block.parentElement;
        container.style.position = 'relative';
        container.appendChild(copyBtn);

        container.addEventListener('mouseenter', () => {
            copyBtn.style.opacity = '1';
        });

        container.addEventListener('mouseleave', () => {
            copyBtn.style.opacity = '0';
        });

        copyBtn.addEventListener('click', () => {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            });
        });
    });
};

// Initialize copy buttons
addCopyButtons();

// ===========================================
// KEYBOARD NAVIGATION (Accessibility)
// ===========================================
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search (if you add search functionality)
    if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        // Focus search input if exists
        const searchInput = document.getElementById('search');
        if (searchInput) searchInput.focus();
    }

    // Press 'Esc' to close mobile menu
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ===========================================
// LAZY LOAD IMAGES (Performance Optimization)
// ===========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================================
// TRACK SCROLL DEPTH (Optional Analytics)
// ===========================================
const trackScrollDepth = () => {
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && !tracked.has(milestone)) {
                tracked.add(milestone);
                console.log(`User scrolled to ${milestone}%`);
                // Here you could send analytics events
                // gtag('event', 'scroll_depth', { depth: milestone });
            }
        });
    });
};

// Uncomment to enable scroll depth tracking
// trackScrollDepth();

// ===========================================
// INITIALIZE ON DOM LOAD
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('TradePose landing page loaded successfully');

    // Add any additional initialization here

    // Example: Add a fade-in to the hero on page load
    setTimeout(() => {
        document.querySelector('.hero').classList.add('fade-in-up');
    }, 100);
});

// ===========================================
// SERVICE WORKER REGISTRATION (For PWA - Optional)
// ===========================================
if ('serviceWorker' in navigator) {
    // Uncomment when you have a service worker file
    /*
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
    */
}

// ===========================================
// EXPORT FOR TESTING (Optional)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        animateCounter
    };
}
