// Utility functions for QuickSave extension

// Input sanitization
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    // Remove HTML tags and script content
    const temp = document.createElement('div');
    temp.textContent = input;
    const sanitized = temp.innerHTML;
    
    // Additional cleaning
    return sanitized
        .replace(/[<>]/g, '') // Remove any remaining angle brackets
        .trim()
        .substring(0, 500); // Limit length
}

// URL validation
export function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'chrome:';
    } catch (error) {
        return false;
    }
}

// Sanitize URL
export function sanitizeUrl(urlString) {
    if (!isValidUrl(urlString)) {
        throw new Error('Invalid URL format');
    }
    return urlString.trim();
}

// Get folder icon based on folder name
export function getFolderIcon(folderTitle) {
    const title = folderTitle.toLowerCase();
    
    if (title.includes('work') || title.includes('job') || title.includes('office')) return '💼';
    if (title.includes('personal') || title.includes('home')) return '🏠';
    if (title.includes('study') || title.includes('learn') || title.includes('education')) return '📚';
    if (title.includes('shopping') || title.includes('buy') || title.includes('store')) return '🛒';
    if (title.includes('travel') || title.includes('trip') || title.includes('vacation')) return '✈️';
    if (title.includes('food') || title.includes('recipe') || title.includes('cook')) return '🍽️';
    if (title.includes('music') || title.includes('song') || title.includes('audio')) return '🎵';
    if (title.includes('video') || title.includes('movie') || title.includes('film')) return '🎬';
    if (title.includes('game') || title.includes('gaming') || title.includes('play')) return '🎮';
    if (title.includes('social') || title.includes('media') || title.includes('network')) return '📱';
    if (title.includes('tech') || title.includes('coding') || title.includes('programming')) return '💻';
    if (title.includes('news') || title.includes('article') || title.includes('blog')) return '📰';
    if (title.includes('finance') || title.includes('money') || title.includes('bank')) return '💰';
    if (title.includes('health') || title.includes('fitness') || title.includes('exercise')) return '💪';
    if (title.includes('art') || title.includes('design') || title.includes('creative')) return '🎨';
    
    return '📁'; // Default folder icon
}

// Auto-categorize based on URL
export function autoCategorize(url) {
    try {
        const domain = new URL(url).hostname.toLowerCase();
        
        if (domain.includes('github.com') || domain.includes('stackoverflow.com')) return '💻';
        if (domain.includes('youtube.com') || domain.includes('netflix.com')) return '🎬';
        if (domain.includes('amazon.com') || domain.includes('ebay.com')) return '🛒';
        if (domain.includes('linkedin.com') || domain.includes('indeed.com')) return '💼';
        if (domain.includes('twitter.com') || domain.includes('facebook.com')) return '📱';
        if (domain.includes('news.') || domain.includes('bbc.com')) return '📰';
        if (domain.includes('bank') || domain.includes('paypal.com')) return '💰';
        
        return null;
    } catch (error) {
        console.error('Error in auto-categorize:', error);
        return null;
    }
}

// Debounce function for search
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date for display
export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Show notification
export function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Export bookmarks to JSON
export function exportToJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Generate unique ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
