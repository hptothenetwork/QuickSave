// Import modules
import * as Storage from './js/storage.js';
import * as Bookmarks from './js/bookmarks.js';
import * as UI from './js/ui.js';
import * as Utils from './js/utils.js';
import * as Extensions from './js/extensions.js';

// Global state
const state = {
    bookmarkTree: [],
    allFolders: [],
    selectedFolder: null,
    recentFolders: [],
    tags: [],
    folderStats: {},
    searchHistory: [],
    settings: {},
    extensions: [],
    currentTab: 'bookmarks'
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
        
        // Setup tab navigation
        setupTabNavigation();
        
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

// ========================================
// EXTENSIONS TAB FUNCTIONALITY
// ========================================

// Setup tab navigation
function setupTabNavigation() {
    const bookmarksTab = document.getElementById('tab-bookmarks');
    const extensionsTab = document.getElementById('tab-extensions');
    const bookmarksPanel = document.getElementById('panel-bookmarks');
    const extensionsPanel = document.getElementById('panel-extensions');
    
    bookmarksTab.addEventListener('click', () => {
        switchTab('bookmarks', bookmarksTab, extensionsTab, bookmarksPanel, extensionsPanel);
    });
    
    extensionsTab.addEventListener('click', () => {
        switchTab('extensions', extensionsTab, bookmarksTab, extensionsPanel, bookmarksPanel);
    });
}

// Switch between tabs
function switchTab(tabName, activeTab, inactiveTab, activePanel, inactivePanel) {
    state.currentTab = tabName;
    
    // Update tab buttons
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
    inactiveTab.classList.remove('active');
    inactiveTab.setAttribute('aria-selected', 'false');
    
    // Update panels
    activePanel.classList.add('active');
    activePanel.removeAttribute('hidden');
    inactivePanel.classList.remove('active');
    inactivePanel.setAttribute('hidden', '');
    
    // Load extensions when switching to extensions tab
    if (tabName === 'extensions' && state.extensions.length === 0) {
        loadExtensions();
    }
}

// Load all extensions
async function loadExtensions() {
    try {
        const extensionsList = document.getElementById('extensions-list');
        extensionsList.innerHTML = '<div class="loading-state">Loading extensions...</div>';
        
        state.extensions = await Extensions.getAllExtensions();
        
        if (state.extensions.length === 0) {
            extensionsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🧩</div>
                    <div class="empty-state-text">No extensions found.<br>Install some extensions to see them here!</div>
                </div>
            `;
            return;
        }
        
        // Display stats
        displayExtensionStats();
        
        // Display extensions
        displayExtensions(state.extensions);
        
        // Setup search
        setupExtensionSearch();
        
    } catch (error) {
        console.error('Error loading extensions:', error);
        UI.showError('Failed to load extensions');
        document.getElementById('extensions-list').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-text">Error loading extensions.<br>Please try again.</div>
            </div>
        `;
    }
}

// Display extension statistics
function displayExtensionStats() {
    const stats = Extensions.getExtensionStats(state.extensions);
    const statsContainer = document.getElementById('extensions-stats');
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.enabled}</div>
            <div class="stat-label">Enabled</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${Object.keys(stats.categories).length}</div>
            <div class="stat-label">Categories</div>
        </div>
    `;
}

// Display extensions list
function displayExtensions(extensions) {
    const extensionsList = document.getElementById('extensions-list');
    
    if (extensions.length === 0) {
        extensionsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">No extensions match your search.</div>
            </div>
        `;
        return;
    }
    
    extensionsList.innerHTML = '';
    
    extensions.forEach(ext => {
        const extElement = createExtensionElement(ext);
        extensionsList.appendChild(extElement);
    });
}

// Create extension element
function createExtensionElement(extension) {
    const extDiv = document.createElement('div');
    extDiv.className = 'extension-item';
    extDiv.setAttribute('role', 'listitem');
    extDiv.setAttribute('data-extension-id', extension.id);
    
    // Icon
    const iconDiv = document.createElement('div');
    iconDiv.className = 'extension-icon';
    if (extension.icon) {
        const img = document.createElement('img');
        img.src = extension.icon;
        img.alt = `${extension.name} icon`;
        iconDiv.appendChild(img);
    } else {
        iconDiv.textContent = '🧩';
    }
    
    // Info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'extension-info';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'extension-name';
    nameDiv.textContent = extension.name;
    
    const descDiv = document.createElement('div');
    descDiv.className = 'extension-description';
    descDiv.textContent = extension.description || 'No description';
    
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(descDiv);
    
    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'extension-actions';
    
    const openBtn = document.createElement('button');
    openBtn.className = 'extension-action-btn primary';
    openBtn.textContent = 'Open';
    openBtn.setAttribute('aria-label', `Open ${extension.name}`);
    openBtn.onclick = (e) => {
        e.stopPropagation();
        openExtension(extension.id, extension.name);
    };
    
    actionsDiv.appendChild(openBtn);
    
    // Assemble
    extDiv.appendChild(iconDiv);
    extDiv.appendChild(infoDiv);
    extDiv.appendChild(actionsDiv);
    
    // Click to open
    extDiv.addEventListener('click', () => {
        openExtension(extension.id, extension.name);
    });
    
    // Keyboard support
    extDiv.setAttribute('tabindex', '0');
    extDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openExtension(extension.id, extension.name);
        }
    });
    
    return extDiv;
}

// Open extension
async function openExtension(extensionId, extensionName) {
    try {
        const success = await Extensions.openExtensionOptions(extensionId);
        if (success) {
            UI.showSuccess(`Opening ${extensionName}...`);
            // Close popup after short delay
            setTimeout(() => {
                window.close();
            }, 500);
        } else {
            UI.showError('Could not open extension');
        }
    } catch (error) {
        console.error('Error opening extension:', error);
        UI.showError('Failed to open extension');
    }
}

// Setup extension search
function setupExtensionSearch() {
    const searchInput = document.getElementById('search-extensions');
    
    const debouncedSearch = Utils.debounce((searchText) => {
        const filtered = Extensions.searchExtensions(state.extensions, searchText);
        displayExtensions(filtered);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}


