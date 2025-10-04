// Import modules
import * as Storage from './js/storage.js';
import * as Bookmarks from './js/bookmarks.js';
import * as UI from './js/ui.js';
import * as Utils from './js/utils.js';

// Global state
const state = {
    bookmarkTree: [],
    allFolders: [],
    selectedFolder: null,
    recentFolders: [],
    tags: [],
    folderStats: {},
    searchHistory: [],
    settings: {}
};

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check and migrate storage if needed
        await Storage.checkAndMigrate();
        
        // Load theme first
        const theme = await Storage.loadTheme();
        UI.applyTheme(theme);
        
        // Load settings
        state.settings = await Storage.loadSettings();
        
        // Load current tab info
        await loadCurrentTabInfo();
        
        // Load bookmark data
        await loadBookmarkData();
        
        // Load user preferences
        await loadUserPreferences();
        
        // Calculate folder statistics
        state.folderStats = await Bookmarks.calculateFolderStats(state.allFolders);
        
        // Display folders
        displayFolders();
        
        // Setup all event listeners
        setupEventListeners();
        
        // Setup tags system
        setupTagsSystem();
        
        // Apply saved settings to checkboxes
        applySettings();
        
        console.log('QuickSave initialized successfully');
    } catch (error) {
        console.error('Error initializing QuickSave:', error);
        UI.showError('Failed to initialize extension');
    }
});

// Load current active tab details
async function loadCurrentTabInfo() {
    try {
        const tabInfo = await Bookmarks.getCurrentTabInfo();
        document.getElementById('bookmark-name').value = Utils.sanitizeInput(tabInfo.title);
        document.getElementById('bookmark-url').value = tabInfo.url;
    } catch (error) {
        console.error('Error loading tab info:', error);
    }
}

// Load bookmark data
async function loadBookmarkData() {
    try {
        state.bookmarkTree = await Bookmarks.loadBookmarkTree();
        state.allFolders = Bookmarks.extractFolders(state.bookmarkTree);
    } catch (error) {
        console.error('Error loading bookmark data:', error);
    }
}

// Load user preferences
async function loadUserPreferences() {
    try {
        state.recentFolders = await Storage.loadRecentFolders();
        state.searchHistory = await Storage.loadSearchHistory();
    } catch (error) {
        console.error('Error loading user preferences:', error);
    }
}

// Apply settings to UI
function applySettings() {
    document.getElementById('duplicate-check').checked = state.settings.checkDuplicates;
    document.getElementById('auto-categorize').checked = state.settings.autoCategorize;
    document.getElementById('open-folder-checkbox').checked = state.settings.openFolderAfterSave;
}

// Display folders in the list
function displayFolders() {
    const foldersList = document.getElementById('folders-list');
    UI.displayFoldersWithRecent(
        state.allFolders,
        state.recentFolders,
        state.folderStats,
        foldersList,
        onFolderSelect
    );
}

// Handle folder selection
function onFolderSelect(element, folder) {
    state.selectedFolder = UI.selectFolder(
        element,
        folder,
        document.getElementById('search-folders'),
        document.getElementById('folders-list')
    );
    
    // Add to recent folders
    Storage.addToRecentFolders(folder, state.settings.maxRecentFolders)
        .then(recent => {
            state.recentFolders = recent;
        });
}

// Setup tags system
function setupTagsSystem() {
    const tagsInput = document.getElementById('tags-input');
    const tagsDisplay = document.getElementById('tags-display');
    
    tagsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = Utils.sanitizeInput(tagsInput.value.trim());
            if (tag && !state.tags.includes(tag)) {
                state.tags.push(tag);
                updateTagsDisplay();
                tagsInput.value = '';
            }
        }
    });
    
    tagsInput.addEventListener('blur', () => {
        const tag = Utils.sanitizeInput(tagsInput.value.trim());
        if (tag && !state.tags.includes(tag)) {
            state.tags.push(tag);
            updateTagsDisplay();
            tagsInput.value = '';
        }
    });
}

// Update tags display
function updateTagsDisplay() {
    const tagsDisplay = document.getElementById('tags-display');
    UI.displayTags(state.tags, tagsDisplay, removeTag);
}

// Remove tag
function removeTag(tagToRemove) {
    state.tags = state.tags.filter(tag => tag !== tagToRemove);
    updateTagsDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-folders');
    const foldersList = document.getElementById('folders-list');
    
    // Show folders when clicking on search input
    searchInput.addEventListener('focus', () => {
        foldersList.classList.add('show');
        displayFolders();
    });
    
    // Hide folders when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.folder-selector')) {
            foldersList.classList.remove('show');
        }
    });
    
    // Search with debounce
    const debouncedSearch = Utils.debounce((searchText) => {
        if (searchText === '') {
            displayFolders();
        } else {
            const filteredFolders = UI.filterFolders(state.allFolders, searchText);
            const foldersList = document.getElementById('folders-list');
            UI.displayFolders(filteredFolders, state.folderStats, foldersList);
            
            // Add click handlers for filtered folders
            foldersList.querySelectorAll('.folder-item').forEach(item => {
                const folderId = item.dataset.folderId;
                const folder = state.allFolders.find(f => f.id === folderId);
                if (folder) {
                    item.addEventListener('click', () => onFolderSelect(item, folder));
                }
            });
            
            Storage.addToSearchHistory(searchText, state.settings.maxSearchHistory);
        }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value.toLowerCase());
    });
    
    // Save button functionality
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveBookmark);
    
    // Create folder functionality
    const createFolderBtn = document.getElementById('create-folder-btn');
    createFolderBtn.addEventListener('click', createNewFolder);
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // Settings checkboxes - save on change
    document.getElementById('duplicate-check').addEventListener('change', saveSettingsFromUI);
    document.getElementById('auto-categorize').addEventListener('change', saveSettingsFromUI);
    document.getElementById('open-folder-checkbox').addEventListener('change', saveSettingsFromUI);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveBookmark();
        }
        if (e.key === 'Escape') {
            window.close();
        }
    });
}

// Save settings from UI
async function saveSettingsFromUI() {
    state.settings.checkDuplicates = document.getElementById('duplicate-check').checked;
    state.settings.autoCategorize = document.getElementById('auto-categorize').checked;
    state.settings.openFolderAfterSave = document.getElementById('open-folder-checkbox').checked;
    await Storage.saveSettings(state.settings);
}

// Toggle theme
async function toggleTheme() {
    const newTheme = document.body.className === 'dark' ? 'light' : 'dark';
    UI.applyTheme(newTheme);
    await Storage.saveTheme(newTheme);
    UI.showSuccess(`Switched to ${newTheme} theme`);
}

// Save bookmark to selected folder
async function saveBookmark() {
    const name = document.getElementById('bookmark-name').value.trim();
    const url = document.getElementById('bookmark-url').value.trim();
    const note = document.getElementById('bookmark-note')?.value.trim() || '';
    const openFolder = document.getElementById('open-folder-checkbox').checked;
    const checkDuplicates = document.getElementById('duplicate-check').checked;
    const autoCategorizeEnabled = document.getElementById('auto-categorize').checked;
    
    // Validate inputs
    if (!name || !url) {
        UI.showError('Please enter both name and URL');
        return;
    }
    
    if (!Utils.isValidUrl(url)) {
        UI.showError('Please enter a valid URL');
        return;
    }
    
    if (!state.selectedFolder) {
        UI.showError('Please select a folder');
        return;
    }
    
    const saveButton = document.getElementById('save-button');
    UI.setButtonLoading(saveButton, true);
    
    try {
        // Check for duplicates if enabled
        if (checkDuplicates) {
            const duplicates = await Bookmarks.checkForDuplicates(url);
            if (duplicates && duplicates.length > 0) {
                UI.setButtonLoading(saveButton, false);
                const proceed = confirm(`This bookmark already exists in ${duplicates.length} location(s). Do you want to save it anyway?`);
                if (!proceed) return;
                UI.setButtonLoading(saveButton, true);
            }
        }
        
        // Auto-categorize if enabled and no folder manually selected
        if (autoCategorizeEnabled && !state.selectedFolder) {
            const suggestedIcon = Utils.autoCategorize(url);
            if (suggestedIcon) {
                const suggestedFolder = state.allFolders.find(folder => 
                    Utils.getFolderIcon(folder.title) === suggestedIcon
                );
                if (suggestedFolder) {
                    state.selectedFolder = suggestedFolder;
                    document.getElementById('search-folders').value = suggestedFolder.title;
                }
            }
        }
        
        // Create bookmark with tags and note
        const bookmark = await Bookmarks.createBookmark(
            state.selectedFolder.id,
            name,
            url,
            state.tags,
            note
        );
        
        // Update folder stats
        if (state.folderStats[state.selectedFolder.id]) {
            state.folderStats[state.selectedFolder.id].bookmarks++;
        }
        
        // Show success
        UI.showSaveSuccess(saveButton, state.selectedFolder.title);
        UI.showSuccess(`Bookmark saved to ${state.selectedFolder.title}!`);
        
        // Open folder if checkbox is checked
        if (openFolder) {
            try {
                await chrome.tabs.create({ url: 'chrome://bookmarks/' });
            } catch (folderError) {
                console.error('Error opening folder:', folderError);
            }
        }
        
        // Clear tags
        state.tags = [];
        updateTagsDisplay();
        
        // Close the popup after a short delay
        setTimeout(() => {
            window.close();
        }, 1500);
        
    } catch (error) {
        console.error('Error saving bookmark:', error);
        UI.showError(error.message || 'Error saving bookmark. Please try again.');
    } finally {
        UI.setButtonLoading(saveButton, false);
    }
}

// Create new folder
async function createNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName || folderName.trim() === '') return;
    
    try {
        const newFolder = await Bookmarks.createFolder('1', folderName); // '1' is Bookmarks bar
        
        // Add to all folders list
        state.allFolders.push(newFolder);
        
        // Select the new folder
        state.selectedFolder = newFolder;
        document.getElementById('search-folders').value = newFolder.title;
        
        // Refresh folder stats
        state.folderStats = await Bookmarks.calculateFolderStats(state.allFolders);
        
        // Refresh the display
        displayFolders();
        
        // Show success
        UI.showSuccess(`Folder "${folderName}" created successfully!`);
        
    } catch (error) {
        console.error('Error creating folder:', error);
        UI.showError('Error creating folder. Please try again.');
    }
}

// Export data
async function exportData() {
    try {
        const data = await Storage.exportAllData();
        const bookmarkTree = await Bookmarks.loadBookmarkTree();
        
        const exportData = {
            version: '2.0.0',
            exportDate: new Date().toISOString(),
            settings: data,
            bookmarks: bookmarkTree
        };
        
        const filename = `quicksave-backup-${new Date().toISOString().split('T')[0]}.json`;
        Utils.exportToJSON(exportData, filename);
        
        UI.showSuccess('Data exported successfully!');
    } catch (error) {
        console.error('Error exporting data:', error);
        UI.showError('Error exporting data');
    }
}

// Make removeTag available globally for HTML onclick
window.removeTag = removeTag;

