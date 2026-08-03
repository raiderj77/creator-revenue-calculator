// Creator Revenue Calculator - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle, .hamburger');
    const navMenu = document.querySelector('.nav-menu, #navLinks');
    const setMobileMenuLabel = (isOpen) => {
        if (mobileMenuToggle) {
            mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        }
    };
    
    if (mobileMenuToggle && navMenu) {
        if (!mobileMenuToggle.hasAttribute('aria-expanded')) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
        setMobileMenuLabel(mobileMenuToggle.getAttribute('aria-expanded') === 'true');

        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', String(!isOpen));
            setMobileMenuLabel(!isOpen);
            navMenu.classList.toggle('active', !isOpen);
            if (!navMenu.classList.contains('nav-links')) {
                navMenu.style.display = isOpen ? 'none' : 'flex';
            }

            // Update icon
            const icon = this.querySelector('i');
            if (icon && !isOpen) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                if (!navMenu.classList.contains('nav-links')) {
                    navMenu.style.display = 'flex';
                } else {
                    navMenu.style.removeProperty('display');
                }
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                setMobileMenuLabel(false);
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            } else {
                if (!navMenu.classList.contains('nav-links')) {
                    navMenu.style.display = 'none';
                } else {
                    navMenu.style.removeProperty('display');
                }
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                setMobileMenuLabel(false);
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navMenu) {
                    if (!navMenu.classList.contains('nav-links')) {
                        navMenu.style.display = 'none';
                    } else {
                        navMenu.style.removeProperty('display');
                    }
                    navMenu.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        setMobileMenuLabel(false);
                    }
                    const icon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Update copyright year
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement && copyrightElement.textContent.includes('2024')) {
        const currentYear = new Date().getFullYear();
        copyrightElement.textContent = copyrightElement.textContent.replace('2024', currentYear);
    }
    
    // Coming soon buttons tooltip
    const comingSoonButtons = document.querySelectorAll('button:disabled');
    comingSoonButtons.forEach(button => {
        button.title = 'This tool is coming soon!';
        
        button.addEventListener('mouseenter', function() {
            this.style.cursor = 'not-allowed';
        });
    });
    
    // Add active class to current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (linkPath === currentPath || 
            (linkPath === '/' && currentPath === '/index.html') ||
            (linkPath.startsWith('#') && window.location.hash === linkPath)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize tooltips for feature tags
    const featureTags = document.querySelectorAll('.feature-tag');
    featureTags.forEach(tag => {
        tag.title = `Feature: ${tag.textContent}`;
    });
    
});
