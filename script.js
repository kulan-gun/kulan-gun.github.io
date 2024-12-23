/* ==========================================
   Typing animation on index-page hero section
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Typing animation
    const typingElement = document.getElementById('typing-animation');
    const roles = ['a Product Designer...', 'a UX Engineer...', 'a Senior Consultant...'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 50;
    const delayBetweenRoles = 2000;

    // Fade-in paragraph with typing animation after 1-second delay
    const fadeInElement = document.querySelector('.fade-in.hidden');
    if (fadeInElement) {
        setTimeout(() => {
            fadeInElement.classList.remove('hidden');
        }, 1000);
    }

    function typeAnimation() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeAnimation, delayBetweenRoles);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeAnimation, typingSpeed);
        } else {
            setTimeout(typeAnimation, isDeleting ? deletingSpeed : typingSpeed);
        }
    }

    if (typingElement) {
        typeAnimation();
    }

/* ==========================================
   Navigation, scrolling and shimmering text
   ========================================== */

    // Get all sections and navigation items
    const sections = document.querySelectorAll('.case-study-details section');
    const navItems = document.querySelectorAll('.nav-item');

    // Add data-text attribute to shimmering text
    const shimmeringText = document.querySelector('.shimmering-text');
    if (shimmeringText) {
        shimmeringText.setAttribute('data-text', shimmeringText.textContent);
    }

    // Scroll-to-top functionality
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopButton.style.display = 'flex';
            } else {
                scrollToTopButton.style.display = 'none';
            }
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

/* ==========================================
   Observers
   ========================================== */

    // Intersection Observer configuration
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    // Create the observer for main page sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active'));
                
                const activeId = entry.target.id;
                const activeNavItem = document.querySelector(`.nav-item[href="#${activeId}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections on the main page
    sections.forEach(section => {
        observer.observe(section);
    });

/* ==========================================
   Case study vertical menu or vertical.nav
   ========================================== */

    // Left-hand menu highlighting for case study page
    const caseStudySections = document.querySelectorAll('.case-study-details section');
    const leftNavItems = document.querySelectorAll('.vertical-nav .nav-item');

    if (caseStudySections.length > 0 && leftNavItems.length > 0) {
        const caseStudyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    leftNavItems.forEach(item => item.classList.remove('active'));
                    const activeId = entry.target.id;
                    const activeNavItem = document.querySelector(`.vertical-nav .nav-item[href="#${activeId}"]`);
                    if (activeNavItem) {
                        activeNavItem.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        caseStudySections.forEach(section => {
            caseStudyObserver.observe(section);
        });

        // Add click event listeners for the left navigation items
        leftNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                leftNavItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
                const targetId = item.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Handle click events on main nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            item.classList.add('active');
            
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Handle the back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = backButton.href;
        });
    }

    // Set initial active state for "Work" link on the main page
    const workLink = document.querySelector('.nav-link[href="#work"]');
    if (workLink) {
        workLink.classList.add('active');
    }
});

/* ==========================================
   Password protection
   ========================================== */

   const caseStudyCards = document.querySelectorAll('.case-study-card');
   const correctPasswordHash = '0700f63ec526acd63624bb125e8173acf3ed77f0c41e52086aed902d6d5778ae';
   
   // Attach click handlers
   caseStudyCards.forEach(card => {
       card.addEventListener('click', function (e) {
           e.preventDefault();
           const caseStudyUrl = this.getAttribute('data-case-study');
   
           if (caseStudyUrl) {
               promptPassword(caseStudyUrl); // Prompt for password-protected case studies
           } else if (!this.classList.contains('coming-soon')) {
               window.location.href = this.href; // Allow navigation for non-protected links
           }
       });
   });
   
   // Password prompt logic - the solution leverages localStorage for lightweight client-side security
   async function promptPassword(url) {
    const password = prompt("Please enter the password to view this case study:");
    if (password) {
        const hashedPassword = await sha256(password);
        if (hashedPassword === correctPasswordHash) {
            localStorage.setItem('authenticated', 'true'); // Store authentication flag
            window.location.href = url; // Redirect on successful password entry
        } else {
            alert("Incorrect password. Please try again.");
        }
    }
}

   // Password hashing function
   async function sha256(message) {
       const msgBuffer = new TextEncoder().encode(message);
       const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
       const hashArray = Array.from(new Uint8Array(hashBuffer));
       return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   }
   
/* ==========================================
   Scroll animation for case studies
   ========================================== */

   document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.case-study-card');

    // Intersection Observer to detect when cards are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Apply animation class
            }
        });
    }, {
        root: null, // Viewport is the root
        threshold: 0.1, // Trigger when 10% of the card is visible
    });

    // Observe each card
    cards.forEach((card) => {
        observer.observe(card);
    });
});

/* NEW CODE */



