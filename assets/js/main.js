// Creator Revenue Calculator - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Creator Revenue Calculator loaded');
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            
            // Update icon
            const icon = this.querySelector('i');
            if (navMenu.style.display === 'flex') {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.style.display = 'flex';
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
            } else {
                navMenu.style.display = 'none';
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
                    navMenu.style.display = 'none';
                    mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                    mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });
    
    // Tool card animations
    const toolCards = document.querySelectorAll('.tool-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    toolCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
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
    
    // Stats counter animation (optional enhancement)
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetNumber = parseInt(stat.textContent);
                
                if (!isNaN(targetNumber) && targetNumber > 0) {
                    let current = 0;
                    const increment = targetNumber / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetNumber) {
                            stat.textContent = targetNumber + (stat.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 30);
                }
                
                statObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        if (!stat.textContent.includes('%') && !isNaN(parseInt(stat.textContent))) {
            statObserver.observe(stat);
        }
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
    
    // Console greeting
    console.log('%c🎯 Creator Revenue Calculator', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cFree tools for content creators', 'color: #6b7280;');
    console.log('%chttps://creatorrevenuecalculator.com', 'color: #10b981;');
});