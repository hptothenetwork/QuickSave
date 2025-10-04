// Storage management for QuickSave extension

const STORAGE_VERSION = '2.0.0';
const STORAGE_KEYS = {
    VERSION: 'storageVersion',
    THEME: 'theme',
    RECENT_FOLDERS: 'recentFolders',
    SEARCH_HISTORY: 'searchHistory',
    BOOKMARK_TAGS: 'bookmarkTags',
    BOOKMARK_NOTES: 'bookmarkNotes',
    SETTINGS: 'settings'
};

// Default settings
const DEFAULT_SETTINGS = {
    autoCategorizze: false,
    checkDuplicates: true,
    openFolderAfterSave: false,
    maxRecentFolders: 5,
    maxSearchHistory: 10,
    theme: 'dark'
};

// Version migration
export async function checkAndMigrate() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.VERSION]);
        const currentVersion = result[STORAGE_KEYS.VERSION];
        
        if (!currentVersion) {
            // First time setup
            await chrome.storage.local.set({
                [STORAGE_KEYS.VERSION]: STORAGE_VERSION,
                [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
                [STORAGE_KEYS.BOOKMARK_TAGS]: {},
                [STORAGE_KEYS.BOOKMARK_NOTES]: {},
                [STORAGE_KEYS.RECENT_FOLDERS]: [],
                [STORAGE_KEYS.SEARCH_HISTORY]: []
            });
            console.log('Storage initialized');
            return;
        }
        
        // Migration logic for different versions
        if (currentVersion === '1.0.0' || currentVersion === '1.0') {
            await migrateFrom1to2();
        }
        
        // Update version
        await chrome.storage.local.set({ [STORAGE_KEYS.VERSION]: STORAGE_VERSION });
        
    } catch (error) {
        console.error('Error in version migration:', error);
    }
}

// Migrate from version 1.0 to 2.0
async function migrateFrom1to2() {
    console.log('Migrating storage from v1.0 to v2.0');
    
    try {
        const result = await chrome.storage.local.get(null);
        
        // Preserve existing data
        const migrated = {
            [STORAGE_KEYS.VERSION]: STORAGE_VERSION,
            [STORAGE_KEYS.THEME]: result.theme || 'dark',
            [STORAGE_KEYS.RECENT_FOLDERS]: result.recentFolders || [],
            [STORAGE_KEYS.SEARCH_HISTORY]: result.searchHistory || [],
            [STORAGE_KEYS.BOOKMARK_TAGS]: {},
            [STORAGE_KEYS.BOOKMARK_NOTES]: {},
            [STORAGE_KEYS.SETTINGS]: {
                ...DEFAULT_SETTINGS,
                theme: result.theme || 'dark'
            }
        };
        
        await chrome.storage.local.clear();
        await chrome.storage.local.set(migrated);
        
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
    }
}

// Load theme
export async function loadTheme() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
        const settings = result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
        return settings.theme || 'dark';
    } catch (error) {
        console.error('Error loading theme:', error);
        return 'dark';
    }
}

// Save theme
export async function saveTheme(theme) {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
        const settings = result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
        settings.theme = theme;
        await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    } catch (error) {
        console.error('Error saving theme:', error);
    }
}

// Load settings
export async function loadSettings() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
        return result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error loading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

// Save settings
export async function saveSettings(settings) {
    try {
        await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Recent folders management
export async function loadRecentFolders() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.RECENT_FOLDERS]);
        return result[STORAGE_KEYS.RECENT_FOLDERS] || [];
    } catch (error) {
        console.error('Error loading recent folders:', error);
        return [];
    }
}

export async function saveRecentFolders(folders) {
    try {
        await chrome.storage.local.set({ [STORAGE_KEYS.RECENT_FOLDERS]: folders });
    } catch (error) {
        console.error('Error saving recent folders:', error);
    }
}

export async function addToRecentFolders(folder, maxRecent = 5) {
    try {
        let recentFolders = await loadRecentFolders();
        // Remove if already exists
        recentFolders = recentFolders.filter(f => f.id !== folder.id);
        // Add to beginning
        recentFolders.unshift(folder);
        // Keep only last N
        recentFolders = recentFolders.slice(0, maxRecent);
        await saveRecentFolders(recentFolders);
        return recentFolders;
    } catch (error) {
        console.error('Error adding to recent folders:', error);
        return [];
    }
}

// Search history management
export async function loadSearchHistory() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.SEARCH_HISTORY]);
        return result[STORAGE_KEYS.SEARCH_HISTORY] || [];
    } catch (error) {
        console.error('Error loading search history:', error);
        return [];
    }
}

export async function saveSearchHistory(history) {
    try {
        await chrome.storage.local.set({ [STORAGE_KEYS.SEARCH_HISTORY]: history });
    } catch (error) {
        console.error('Error saving search history:', error);
    }
}

export async function addToSearchHistory(searchTerm, maxHistory = 10) {
    if (!searchTerm.trim()) return;
    
    try {
        let searchHistory = await loadSearchHistory();
        searchHistory = searchHistory.filter(term => term !== searchTerm);
        searchHistory.unshift(searchTerm);
        searchHistory = searchHistory.slice(0, maxHistory);
        await saveSearchHistory(searchHistory);
    } catch (error) {
        console.error('Error adding to search history:', error);
    }
}

// Bookmark tags management
export async function loadBookmarkTags() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.BOOKMARK_TAGS]);
        return result[STORAGE_KEYS.BOOKMARK_TAGS] || {};
    } catch (error) {
        console.error('Error loading bookmark tags:', error);
        return {};
    }
}

export async function saveBookmarkTags(bookmarkId, tags) {
    try {
        const allTags = await loadBookmarkTags();
        allTags[bookmarkId] = tags;
        await chrome.storage.local.set({ [STORAGE_KEYS.BOOKMARK_TAGS]: allTags });
    } catch (error) {
        console.error('Error saving bookmark tags:', error);
    }
}

export async function getBookmarkTags(bookmarkId) {
    try {
        const allTags = await loadBookmarkTags();
        return allTags[bookmarkId] || [];
    } catch (error) {
        console.error('Error getting bookmark tags:', error);
        return [];
    }
}

export async function searchByTag(tag) {
    try {
        const allTags = await loadBookmarkTags();
        const bookmarkIds = [];
        
        for (const [bookmarkId, tags] of Object.entries(allTags)) {
            if (tags.includes(tag)) {
                bookmarkIds.push(bookmarkId);
            }
        }
        
        return bookmarkIds;
    } catch (error) {
        console.error('Error searching by tag:', error);
        return [];
    }
}

// Bookmark notes management
export async function loadBookmarkNotes() {
    try {
        const result = await chrome.storage.local.get([STORAGE_KEYS.BOOKMARK_NOTES]);
        return result[STORAGE_KEYS.BOOKMARK_NOTES] || {};
    } catch (error) {
        console.error('Error loading bookmark notes:', error);
        return {};
    }
}

export async function saveBookmarkNote(bookmarkId, note) {
    try {
        const allNotes = await loadBookmarkNotes();
        allNotes[bookmarkId] = note;
        await chrome.storage.local.set({ [STORAGE_KEYS.BOOKMARK_NOTES]: allNotes });
    } catch (error) {
        console.error('Error saving bookmark note:', error);
    }
}

export async function getBookmarkNote(bookmarkId) {
    try {
        const allNotes = await loadBookmarkNotes();
        return allNotes[bookmarkId] || '';
    } catch (error) {
        console.error('Error getting bookmark note:', error);
        return '';
    }
}

// Export all data
export async function exportAllData() {
    try {
        const data = await chrome.storage.local.get(null);
        return data;
    } catch (error) {
        console.error('Error exporting data:', error);
        return {};
    }
}

// Import data
export async function importData(data) {
    try {
        await chrome.storage.local.set(data);
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

// Clear all data
export async function clearAllData() {
    try {
        await chrome.storage.local.clear();
        await checkAndMigrate(); // Reinitialize
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}
