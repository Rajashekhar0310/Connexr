/**
 * Smart Header Scroll Behavior (Updated)
 * 
 * Features:
 * - Header visible at page top (banner area)
 * - Hides when scrolling down
 * - Shows again when scrolling back to top
 * - Detects video growth/expansion
 * - Overlays on top of video with semi-transparent background
 * - Smart text color based on background
 */

(function() {
    const header = document.querySelector('.site-header');
    
    if (!header) return; // Exit if header doesn't exist
    
    let lastScrollPos = 0;
    let isHeaderVisible = true;
    let isOverVideo = false;
    let scrollTimeout;
    let resizeTimeout;
    
    // Configuration
    const config = {
        hideThreshold: 100,        // Pixels to scroll before hiding (at top)
        showThreshold: 50,         // Pixels to scroll back before showing
        bannerHeight: 600,         // Height of banner/video section (ADJUST THIS!)
        debounceDelay: 50,         // Debounce scroll events (ms)
        videoSelector: 'video, [class*="video"], [class*="banner"], [class*="hero"]'  // Selectors for video elements
    };
    
    /**
     * Detect if header is over an expanding/large video
     */
    function checkIfOverVideo() {
        const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if user is scrolled within or near video section
        if (currentScrollPos < config.bannerHeight + 200) {
            // Try to find video element(s)
            const videoElements = document.querySelectorAll('video, [class*="video"], [class*="fullscreen"]');
            
            let isVideoExpanded = false;
            
            if (videoElements.length > 0) {
                // Check if any video is playing or taking significant space
                for (let video of videoElements) {
                    const rect = video.getBoundingClientRect();
                    
                    // If video height is significant (more than 300px), consider it expanded
                    if (rect.height > 300 || video.offsetHeight > 300) {
                        isVideoExpanded = true;
                        break;
                    }
                }
            }
            
            // Also check if we're in the banner area (top of page)
            if (currentScrollPos < config.bannerHeight) {
                isVideoExpanded = true;
            }
            
            return isVideoExpanded;
        }
        
        return false;
    }
    
    /**
     * Update header styling based on video state
     */
    function updateHeaderStyle() {
        const newOverVideoState = checkIfOverVideo();
        
        if (newOverVideoState !== isOverVideo) {
            isOverVideo = newOverVideoState;
            
            if (isOverVideo) {
                header.classList.add('over-video');
            } else {
                header.classList.remove('over-video');
            }
        }
    }
    
    /**
     * Handle scroll events with debounce
     */
    function handleScroll() {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDirection = currentScrollPos > lastScrollPos ? 'down' : 'up';
            
            // ── BEHAVIOR LOGIC ──
            
            // 1. If at top (within banner), always show
            if (currentScrollPos <= config.bannerHeight) {
                showHeader();
                removeScrolledClass();
            }
            // 2. If scrolling down, hide header
            else if (scrollDirection === 'down' && currentScrollPos > config.hideThreshold) {
                hideHeader();
                addScrolledClass();
            }
            // 3. If scrolling up back to near-top, show header
            else if (scrollDirection === 'up' && currentScrollPos < (config.bannerHeight + config.showThreshold)) {
                showHeader();
                addScrolledClass();
            }
            
            // Update video overlay state
            updateHeaderStyle();
            
            lastScrollPos = currentScrollPos;
        }, config.debounceDelay);
    }
    
    /**
     * Handle window resize (video might expand)
     */
    function handleResize() {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(() => {
            updateHeaderStyle();
        }, 150);
    }
    
    /**
     * Show header with animation
     */
    function showHeader() {
        if (!isHeaderVisible) {
            header.classList.remove('hidden');
            header.classList.add('visible');
            isHeaderVisible = true;
        }
    }
    
    /**
     * Hide header with animation
     */
    function hideHeader() {
        if (isHeaderVisible) {
            header.classList.remove('visible');
            header.classList.add('hidden');
            isHeaderVisible = false;
        }
    }
    
    /**
     * Add subtle background when scrolled
     */
    function addScrolledClass() {
        if (!header.classList.contains('scrolled')) {
            header.classList.add('scrolled');
        }
    }
    
    /**
     * Remove background on top
     */
    function removeScrolledClass() {
        header.classList.remove('scrolled');
    }
    
    /**
     * Initialize on page load
     */
    function init() {
        // Set initial state
        if (window.pageYOffset <= config.bannerHeight) {
            showHeader();
            removeScrolledClass();
        } else {
            hideHeader();
            addScrolledClass();
        }
        
        // Check initial video state
        updateHeaderStyle();
        
        // Attach scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Attach resize listener (for video expansion)
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Monitor for DOM changes (video might be dynamically added/expanded)
        // Use MutationObserver if available
        if (window.MutationObserver) {
            const observer = new MutationObserver(() => {
                updateHeaderStyle();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
    });
    
})();