/**
 * Cookie Consent Banner for Creator Revenue Calculator
 * Simple, accessible cookie consent for static HTML site
 */

(function() {
    'use strict';
    
    // Configuration
    const COOKIE_NAME = 'crc_consent';
    const COOKIE_EXPIRY_DAYS = 365;
    const BANNER_ID = 'cookie-consent-banner';
    
    // Consent preferences
    const DEFAULT_CONSENT = {
        essential: true,
        analytics: false,
        advertising: false,
        timestamp: null
    };
    
    // Check if consent banner should be shown
    function shouldShowBanner() {
        const consent = getCookie(COOKIE_NAME);
        return !consent;
    }
    
    // Get cookie value
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Set cookie
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }
    
    // Save consent preferences
    function saveConsent(preferences) {
        preferences.timestamp = new Date().toISOString();
        setCookie(COOKIE_NAME, JSON.stringify(preferences), COOKIE_EXPIRY_DAYS);
        applyConsent(preferences);
        hideBanner();
    }
    
    // Apply consent to third-party services
    function applyConsent(preferences) {
        // Google Analytics (if implemented)
        if (typeof window.gtag !== 'undefined') {
            window.gtag('consent', 'update', {
                analytics_storage: preferences.analytics ? 'granted' : 'denied',
                ad_storage: preferences.advertising ? 'granted' : 'denied'
            });
        }
        
        // Log for debugging
        console.log('Cookie consent applied:', preferences);
    }
    
    // Create and show banner
    function showBanner() {
        // Don't show if already exists
        if (document.getElementById(BANNER_ID)) return;
        
        // Create banner HTML
        const bannerHTML = `
            <div id="${BANNER_ID}" class="cookie-consent-banner" role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description">
                <div class="cookie-consent-content">
                    <div class="cookie-consent-text">
                        <h3 id="cookie-consent-title">Cookie Consent</h3>
                        <p id="cookie-consent-description">
                            We use cookies to enhance your experience, analyze traffic, and serve ads via Google AdSense. 
                            <a href="/cookies.html" class="cookie-policy-link">Learn more in our Cookie Policy</a>
                        </p>
                        <div class="cookie-consent-controls">
                            <button type="button" class="cookie-btn cookie-btn-essential" aria-label="Accept essential cookies only">
                                Essential Only
                            </button>
                            <button type="button" class="cookie-btn cookie-btn-accept" aria-label="Accept all cookies">
                                Accept All
                            </button>
                            <button type="button" class="cookie-btn cookie-btn-customize" aria-label="Customize cookie preferences">
                                Customize
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Customization Panel (hidden by default) -->
                <div class="cookie-customization-panel" style="display: none;">
                    <h4>Customize Your Preferences</h4>
                    <div class="cookie-option">
                        <label class="cookie-option-label">
                            <input type="checkbox" class="cookie-option-checkbox" checked disabled>
                            <span class="cookie-option-text">
                                <strong>Essential Cookies</strong>
                                <small>Required for basic site functionality. Cannot be disabled.</small>
                            </span>
                        </label>
                    </div>
                    <div class="cookie-option">
                        <label class="cookie-option-label">
                            <input type="checkbox" class="cookie-option-checkbox" id="cookie-analytics">
                            <span class="cookie-option-text">
                                <strong>Analytics Cookies</strong>
                                <small>Help us understand how visitors use our calculators.</small>
                            </span>
                        </label>
                    </div>
                    <div class="cookie-option">
                        <label class="cookie-option-label">
                            <input type="checkbox" class="cookie-option-checkbox" id="cookie-advertising">
                            <span class="cookie-option-text">
                                <strong>Advertising Cookies</strong>
                                <small>Used by Google AdSense to show relevant ads.</small>
                            </span>
                        </label>
                    </div>
                    <div class="cookie-customization-controls">
                        <button type="button" class="cookie-btn cookie-btn-save" aria-label="Save customized preferences">
                            Save Preferences
                        </button>
                        <button type="button" class="cookie-btn cookie-btn-back" aria-label="Back to main cookie options">
                            Back
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        // Add CSS if not already present
        if (!document.querySelector('#cookie-consent-styles')) {
            const style = document.createElement('style');
            style.id = 'cookie-consent-styles';
            style.textContent = getBannerCSS();
            document.head.appendChild(style);
        }
        
        // Add event listeners
        setupEventListeners();
    }
    
    // Get banner CSS
    function getBannerCSS() {
        return `
            .cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #2c3e50;
                color: white;
                padding: 20px;
                z-index: 1000;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }
            
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }
            
            .cookie-consent-text {
                flex: 1;
            }
            
            .cookie-consent-text h3 {
                margin: 0 0 10px 0;
                font-size: 1.2rem;
                color: #3498db;
            }
            
            .cookie-consent-text p {
                margin: 0 0 15px 0;
                font-size: 0.95rem;
                line-height: 1.5;
                color: #ecf0f1;
            }
            
            .cookie-policy-link {
                color: #3498db;
                text-decoration: underline;
            }
            
            .cookie-policy-link:hover {
                color: #2980b9;
            }
            
            .cookie-consent-controls {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            
            .cookie-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .cookie-btn-essential {
                background: #7f8c8d;
                color: white;
            }
            
            .cookie-btn-essential:hover {
                background: #95a5a6;
            }
            
            .cookie-btn-accept {
                background: #2ecc71;
                color: white;
            }
            
            .cookie-btn-accept:hover {
                background: #27ae60;
            }
            
            .cookie-btn-customize {
                background: transparent;
                color: #3498db;
                border: 2px solid #3498db;
            }
            
            .cookie-btn-customize:hover {
                background: rgba(52, 152, 219, 0.1);
            }
            
            .cookie-customization-panel {
                background: #34495e;
                padding: 20px;
                border-radius: 4px;
                margin-top: 20px;
            }
            
            .cookie-customization-panel h4 {
                margin: 0 0 15px 0;
                color: #3498db;
            }
            
            .cookie-option {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(255,255,255,0.05);
                border-radius: 4px;
            }
            
            .cookie-option-label {
                display: flex;
                align-items: flex-start;
                cursor: pointer;
                gap: 10px;
            }
            
            .cookie-option-checkbox {
                margin-top: 3px;
            }
            
            .cookie-option-text {
                flex: 1;
            }
            
            .cookie-option-text strong {
                display: block;
                margin-bottom: 5px;
                color: #ecf0f1;
            }
            
            .cookie-option-text small {
                display: block;
                color: #bdc3c7;
                font-size: 0.85rem;
                line-height: 1.4;
            }
            
            .cookie-customization-controls {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .cookie-btn-save {
                background: #3498db;
                color: white;
            }
            
            .cookie-btn-save:hover {
                background: #2980b9;
            }
            
            .cookie-btn-back {
                background: transparent;
                color: #bdc3c7;
                border: 1px solid #7f8c8d;
            }
            
            .cookie-btn-back:hover {
                background: rgba(255,255,255,0.05);
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-consent-controls {
                    justify-content: center;
                }
                
                .cookie-customization-controls {
                    justify-content: center;
                }
            }
            
            @media (max-width: 480px) {
                .cookie-consent-banner {
                    padding: 15px;
                }
                
                .cookie-btn {
                    padding: 8px 16px;
                    font-size: 0.85rem;
                }
            }
        `;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        const banner = document.getElementById(BANNER_ID);
        
        // Essential only button
        banner.querySelector('.cookie-btn-essential').addEventListener('click', function() {
            saveConsent({
                essential: true,
                analytics: false,
                advertising: false
            });
        });
        
        // Accept all button
        banner.querySelector('.cookie-btn-accept').addEventListener('click', function() {
            saveConsent({
                essential: true,
                analytics: true,
                advertising: true
            });
        });
        
        // Customize button
        banner.querySelector('.cookie-btn-customize').addEventListener('click', function() {
            banner.querySelector('.cookie-consent-content').style.display = 'none';
            banner.querySelector('.cookie-customization-panel').style.display = 'block';
        });
        
        // Back button
        banner.querySelector('.cookie-btn-back').addEventListener('click', function() {
            banner.querySelector('.cookie-consent-content').style.display = 'block';
            banner.querySelector('.cookie-customization-panel').style.display = 'none';
        });
        
        // Save preferences button
        banner.querySelector('.cookie-btn-save').addEventListener('click', function() {
            const preferences = {
                essential: true,
                analytics: document.getElementById('cookie-analytics').checked,
                advertising: document.getElementById('cookie-advertising').checked
            };
            saveConsent(preferences);
        });
    }
    
    // Hide banner
    function hideBanner() {
        const banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.style.transform = 'translateY(100%)';
            banner.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    // Initialize
    function init() {
        // Check if we should show banner
        if (shouldShowBanner()) {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showBanner);
            } else {
                showBanner();
            }
        } else {
            // Load saved preferences
            const saved = getCookie(COOKIE_NAME);
            if (saved) {
                try {
                    applyConsent(JSON.parse(saved));
                } catch (e) {
                    console.error('Error parsing saved consent:', e);
                }
            }
        }
    }
    
    // Make functions available globally for manual control
    window.CookieConsent = {
        showBanner: showBanner,
        hideBanner: hideBanner,
        saveConsent: saveConsent,
        getConsent: function() {
            const saved = getCookie(COOKIE_NAME);
            return saved ? JSON.parse(saved) : null;
        },
        resetConsent: function() {
            setCookie(COOKIE_NAME, '', -1);
            location.reload();
        }
    };
    
    // Initialize
    init();
    
})();