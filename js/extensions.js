// Extension management for QuickSave
import { sanitizeInput } from './utils.js';

// Get all installed extensions
export async function getAllExtensions() {
    try {
        const extensions = await chrome.management.getAll();
        
        // Filter out apps, themes, and this extension itself
        return extensions.filter(ext => 
            ext.type === 'extension' && 
            ext.enabled &&
            ext.id !== chrome.runtime.id // Exclude QuickSave itself
        ).map(ext => ({
            id: ext.id,
            name: ext.name,
            description: ext.description || '',
            enabled: ext.enabled,
            icon: getExtensionIcon(ext),
            shortName: ext.shortName || ext.name,
            version: ext.version,
            homepageUrl: ext.homepageUrl || '',
            installType: ext.installType
        }));
    } catch (error) {
        console.error('Error getting extensions:', error);
        return [];
    }
}

// Get extension icon
function getExtensionIcon(extension) {
    if (extension.icons && extension.icons.length > 0) {
        // Get the largest icon
        const sortedIcons = extension.icons.sort((a, b) => b.size - a.size);
        return sortedIcons[0].url;
    }
    return null;
}

// Open extension options page
export async function openExtensionOptions(extensionId) {
    try {
        const extension = await chrome.management.get(extensionId);
        
        if (extension.optionsUrl) {
            await chrome.tabs.create({ url: extension.optionsUrl });
            return true;
        } else {
            // Try to open the extension's page in chrome://extensions
            await chrome.tabs.create({ url: `chrome://extensions/?id=${extensionId}` });
            return true;
        }
    } catch (error) {
        console.error('Error opening extension:', error);
        return false;
    }
}

// Launch an app (if it's an app)
export async function launchExtension(extensionId) {
    try {
        const extension = await chrome.management.get(extensionId);
        
        if (extension.type === 'hosted_app' || extension.type === 'packaged_app') {
            await chrome.management.launchApp(extensionId);
            return true;
        } else {
            // For regular extensions, open their options or details page
            return await openExtensionOptions(extensionId);
        }
    } catch (error) {
        console.error('Error launching extension:', error);
        return false;
    }
}

// Enable/disable extension
export async function toggleExtension(extensionId, enabled) {
    try {
        await chrome.management.setEnabled(extensionId, enabled);
        return true;
    } catch (error) {
        console.error('Error toggling extension:', error);
        return false;
    }
}

// Uninstall extension
export async function uninstallExtension(extensionId) {
    try {
        await chrome.management.uninstall(extensionId);
        return true;
    } catch (error) {
        console.error('Error uninstalling extension:', error);
        return false;
    }
}

// Search extensions by name or description
export function searchExtensions(extensions, searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
        return extensions;
    }
    
    const term = sanitizeInput(searchTerm).toLowerCase();
    
    return extensions.filter(ext => 
        ext.name.toLowerCase().includes(term) ||
        ext.description.toLowerCase().includes(term) ||
        (ext.shortName && ext.shortName.toLowerCase().includes(term))
    );
}

// Sort extensions
export function sortExtensions(extensions, sortBy = 'name') {
    const sorted = [...extensions];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'recent':
            // Could implement recent usage tracking
            return sorted;
        default:
            return sorted;
    }
}

// Get extension categories (basic classification)
export function categorizeExtension(extension) {
    const name = extension.name.toLowerCase();
    const desc = extension.description.toLowerCase();
    
    if (name.includes('ad') && (name.includes('block') || name.includes('blocker'))) return 'Ad Blockers';
    if (name.includes('password') || name.includes('auth')) return 'Security';
    if (name.includes('video') || name.includes('youtube')) return 'Media';
    if (name.includes('dark') || name.includes('theme')) return 'Themes';
    if (name.includes('dev') || name.includes('debug') || name.includes('inspect')) return 'Developer Tools';
    if (name.includes('translate') || name.includes('dictionary')) return 'Language';
    if (name.includes('shopping') || name.includes('coupon') || name.includes('price')) return 'Shopping';
    if (name.includes('social') || name.includes('twitter') || name.includes('facebook')) return 'Social';
    if (name.includes('productivity') || name.includes('todo') || name.includes('note')) return 'Productivity';
    if (name.includes('download') || name.includes('manager')) return 'Downloads';
    
    return 'Other';
}

// Get extension statistics
export function getExtensionStats(extensions) {
    return {
        total: extensions.length,
        enabled: extensions.filter(e => e.enabled).length,
        disabled: extensions.filter(e => !e.enabled).length,
        categories: groupByCategory(extensions)
    };
}

// Group extensions by category
function groupByCategory(extensions) {
    const categories = {};
    
    extensions.forEach(ext => {
        const category = categorizeExtension(ext);
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(ext);
    });
    
    return categories;
}
