// Global variables
let bookmarkTree = [];
let allFolders = [];
let selectedFolder = null;
let recentFolders = [];
let tags = [];
let folderStats = {};
let searchHistory = [];

// Initialize when popup opens
document.addEventListener('DOMContentLoaded', async () => {
    await loadTheme();
    await getCurrentTabInfo();
    await loadBookmarkTree();
    await loadRecentFolders();
    await loadSearchHistory();
    await calculateFolderStats();
    displayFoldersWithRecent();
    setupEventListeners();
    setupTagsSystem();
});

// Get current active tab details
async function getCurrentTabInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        document.getElementById('bookmark-name').value = tab.title || '';
        document.getElementById('bookmark-url').value = tab.url || '';
    } catch (error) {
        console.error('Error getting tab info:', error);
    }
}

// Load bookmark tree from browser
async function loadBookmarkTree() {
    try {
        bookmarkTree = await chrome.bookmarks.getTree();
        allFolders = extractFolders(bookmarkTree);
    } catch (error) {
        console.error('Error loading bookmark tree:', error);
    }
}

// Extract all folders from bookmark tree
function extractFolders(nodes, folders = []) {
    for (const node of nodes) {
        if (node.children) {
            // This is a folder
            folders.push({
                id: node.id,
                title: node.title || 'Bookmarks',
                parentId: node.parentId
            });
            
            // Recursively find folders in children
            extractFolders(node.children, folders);
        }
    }
    return folders;
}

// Get folder icon based on folder name
function getFolderIcon(folderTitle) {
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

// Display folders in the list
function displayFolders(foldersToShow = allFolders) {
    const foldersList = document.getElementById('folders-list');
    foldersList.innerHTML = '';
    
    foldersToShow.forEach(folder => {
        const folderElement = document.createElement('div');
        folderElement.className = 'folder-item';
        folderElement.dataset.folderId = folder.id;
        
        // Create icon span
        const iconSpan = document.createElement('span');
        iconSpan.className = 'folder-icon';
        iconSpan.textContent = getFolderIcon(folder.title);
        
        // Create title span
        const titleSpan = document.createElement('span');
        titleSpan.className = 'folder-title';
        titleSpan.textContent = folder.title;
        
        folderElement.appendChild(iconSpan);
        folderElement.appendChild(titleSpan);
        
        folderElement.addEventListener('click', () => selectFolder(folderElement, folder));
        
        foldersList.appendChild(folderElement);
    });
}

// Load recent folders from storage
async function loadRecentFolders() {
    try {
        const result = await chrome.storage.local.get(['recentFolders']);
        recentFolders = result.recentFolders || [];
    } catch (error) {
        console.error('Error loading recent folders:', error);
        recentFolders = [];
    }
}

// Save recent folders to storage
async function saveRecentFolders() {
    try {
        await chrome.storage.local.set({ recentFolders: recentFolders });
    } catch (error) {
        console.error('Error saving recent folders:', error);
    }
}

// Add folder to recent list
function addToRecentFolders(folder) {
    // Remove if already exists
    recentFolders = recentFolders.filter(f => f.id !== folder.id);
    // Add to beginning
    recentFolders.unshift(folder);
    // Keep only last 5
    recentFolders = recentFolders.slice(0, 5);
    saveRecentFolders();
}

// Display folders with recent section
function displayFoldersWithRecent() {
    const foldersList = document.getElementById('folders-list');
    foldersList.innerHTML = '';
    
    // Add recent folders section if there are recent folders
    if (recentFolders.length > 0) {
        const recentSection = document.createElement('div');
        recentSection.className = 'folder-section';
        recentSection.innerHTML = '<div class="section-title">Recent</div>';
        
        recentFolders.forEach(folder => {
            const folderElement = createFolderElement(folder, 'recent');
            recentSection.appendChild(folderElement);
        });
        
        foldersList.appendChild(recentSection);
        
        // Add separator
        const separator = document.createElement('div');
        separator.className = 'folder-separator';
        foldersList.appendChild(separator);
    }
    
    // Add all folders
    allFolders.forEach(folder => {
        const folderElement = createFolderElement(folder, 'all');
        foldersList.appendChild(folderElement);
    });
}

// Calculate folder statistics
async function calculateFolderStats() {
    try {
        for (const folder of allFolders) {
            const children = await chrome.bookmarks.getChildren(folder.id);
            const bookmarkCount = children.filter(child => child.url).length;
            const subfolderCount = children.filter(child => child.children).length;
            folderStats[folder.id] = {
                bookmarks: bookmarkCount,
                subfolders: subfolderCount,
                total: children.length
            };
        }
    } catch (error) {
        console.error('Error calculating folder stats:', error);
    }
}

// Load search history
async function loadSearchHistory() {
    try {
        const result = await chrome.storage.local.get(['searchHistory']);
        searchHistory = result.searchHistory || [];
    } catch (error) {
        console.error('Error loading search history:', error);
        searchHistory = [];
    }
}

// Save search history
async function saveSearchHistory() {
    try {
        await chrome.storage.local.set({ searchHistory: searchHistory });
    } catch (error) {
        console.error('Error saving search history:', error);
    }
}

// Add to search history
function addToSearchHistory(searchTerm) {
    if (searchTerm.trim()) {
        searchHistory = searchHistory.filter(term => term !== searchTerm);
        searchHistory.unshift(searchTerm);
        searchHistory = searchHistory.slice(0, 10); // Keep last 10 searches
        saveSearchHistory();
    }
}

// Setup tags system
function setupTagsSystem() {
    const tagsInput = document.getElementById('tags-input');
    const tagsDisplay = document.getElementById('tags-display');
    
    tagsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagsInput.value.trim();
            if (tag && !tags.includes(tag)) {
                tags.push(tag);
                displayTags();
                tagsInput.value = '';
            }
        }
    });
    
    tagsInput.addEventListener('blur', () => {
        const tag = tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            displayTags();
            tagsInput.value = '';
        }
    });
}

// Display tags
function displayTags() {
    const tagsDisplay = document.getElementById('tags-display');
    tagsDisplay.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <button class="tag-remove" onclick="removeTag('${tag}')">×</button>
        `;
        tagsDisplay.appendChild(tagElement);
    });
}

// Remove tag
function removeTag(tagToRemove) {
    tags = tags.filter(tag => tag !== tagToRemove);
    displayTags();
}

// Check for duplicate bookmarks
async function checkForDuplicates(url) {
    try {
        const allBookmarks = await chrome.bookmarks.search({ url: url });
        return allBookmarks.length > 0;
    } catch (error) {
        console.error('Error checking for duplicates:', error);
        return false;
    }
}

// Auto-categorize based on URL
function autoCategorize(url) {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('github.com') || domain.includes('stackoverflow.com')) return '💻';
    if (domain.includes('youtube.com') || domain.includes('netflix.com')) return '🎬';
    if (domain.includes('amazon.com') || domain.includes('ebay.com')) return '🛒';
    if (domain.includes('linkedin.com') || domain.includes('indeed.com')) return '💼';
    if (domain.includes('twitter.com') || domain.includes('facebook.com')) return '📱';
    if (domain.includes('news.') || domain.includes('bbc.com')) return '📰';
    if (domain.includes('bank') || domain.includes('paypal.com')) return '💰';
    
    return null;
}

// Create folder element with enhanced display
function createFolderElement(folder, type) {
    const folderElement = document.createElement('div');
    folderElement.className = `folder-item ${type}`;
    folderElement.dataset.folderId = folder.id;
    
    // Create folder content
    const folderContent = document.createElement('div');
    folderContent.className = 'folder-item-content';
    
    // Create icon span
    const iconSpan = document.createElement('span');
    iconSpan.className = 'folder-icon';
    iconSpan.textContent = getFolderIcon(folder.title);
    
    // Create title span
    const titleSpan = document.createElement('span');
    titleSpan.className = 'folder-title';
    titleSpan.textContent = folder.title;
    
    folderContent.appendChild(iconSpan);
    folderContent.appendChild(titleSpan);
    
    // Create stats span
    const statsSpan = document.createElement('span');
    statsSpan.className = 'folder-stats';
    const stats = folderStats[folder.id] || { bookmarks: 0, subfolders: 0 };
    statsSpan.textContent = `${stats.bookmarks} 📄`;
    
    folderElement.appendChild(folderContent);
    folderElement.appendChild(statsSpan);
    
    folderElement.addEventListener('click', () => selectFolder(folderElement, folder));
    
    return folderElement;
}

// Select a folder
function selectFolder(element, folder) {
    // Remove previous selection
    document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Add selection to clicked folder
    element.classList.add('selected');
    selectedFolder = folder;
    
    // Add to recent folders
    addToRecentFolders(folder);
    
    // Update search input with selected folder name
    document.getElementById('search-folders').value = folder.title;
    
    // Hide the dropdown
    document.getElementById('folders-list').classList.remove('show');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-folders');
    const foldersList = document.getElementById('folders-list');
    
    // Show folders when clicking on search input
    searchInput.addEventListener('focus', () => {
        foldersList.classList.add('show');
        displayFoldersWithRecent();
    });
    
    // Hide folders when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.folder-selector')) {
            foldersList.classList.remove('show');
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        
        if (searchText === '') {
            displayFoldersWithRecent();
        } else {
            const filteredFolders = allFolders.filter(folder =>
                folder.title.toLowerCase().includes(searchText)
            );
            displayFolders(filteredFolders);
        }
    });
    
    // Save search to history when user stops typing
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (e.target.value.trim()) {
                addToSearchHistory(e.target.value.trim());
            }
        }, 1000);
    });
    
    // Save button functionality
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveBookmark);
    

    
    // Create folder functionality
    const createFolderBtn = document.getElementById('create-folder-btn');
    createFolderBtn.addEventListener('click', createNewFolder);
    
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

// Save bookmark to selected folder
async function saveBookmark() {
    const name = document.getElementById('bookmark-name').value.trim();
    const url = document.getElementById('bookmark-url').value.trim();
    const openFolder = document.getElementById('open-folder-checkbox').checked;
    const checkDuplicates = document.getElementById('duplicate-check').checked;
    const autoCategorizeEnabled = document.getElementById('auto-categorize').checked;
    
    if (!name || !url) {
        alert('Please enter both name and URL');
        return;
    }
    
    if (!selectedFolder) {
        alert('Please select a folder');
        return;
    }
    
    // Check for duplicates if enabled
    if (checkDuplicates) {
        const isDuplicate = await checkForDuplicates(url);
        if (isDuplicate) {
            const proceed = confirm('This bookmark already exists. Do you want to save it anyway?');
            if (!proceed) return;
        }
    }
    
    // Auto-categorize if enabled and no folder selected
    if (autoCategorizeEnabled && !selectedFolder) {
        const suggestedIcon = autoCategorize(url);
        if (suggestedIcon) {
            // Find folder with matching icon
            const suggestedFolder = allFolders.find(folder => 
                getFolderIcon(folder.title) === suggestedIcon
            );
            if (suggestedFolder) {
                selectedFolder = suggestedFolder;
                document.getElementById('search-folders').value = suggestedFolder.title;
            }
        }
    }
    
    try {
        // Create bookmark with tags in description
        const description = tags.length > 0 ? `Tags: ${tags.join(', ')}` : '';
        const bookmark = await chrome.bookmarks.create({
            parentId: selectedFolder.id,
            title: name,
            url: url
        });
        
        // Update folder stats
        if (folderStats[selectedFolder.id]) {
            folderStats[selectedFolder.id].bookmarks++;
        }
        
        // Show success message
        const saveButton = document.getElementById('save-button');
        saveButton.textContent = 'Saved!';
        saveButton.classList.add('success');
        
        // Open folder if checkbox is checked
        if (openFolder) {
            try {
                // Open the bookmarks manager page
                await chrome.tabs.create({
                    url: 'chrome://bookmarks/'
                });
                
                // Show a detailed success message with folder info
                const saveButton = document.getElementById('save-button');
                saveButton.textContent = `Saved to ${selectedFolder.title}!`;
                saveButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                
                // Show a helpful alert with instructions
                setTimeout(() => {
                    alert(`✅ Bookmark "${name}" was saved to folder "${selectedFolder.title}"!\n\n📁 To find it:\n1. Look for the "${selectedFolder.title}" folder in the left sidebar\n2. Click on it to see your bookmark\n3. It will be at the top of the list (most recent)`);
                }, 300);
            } catch (folderError) {
                console.error('Error opening folder:', folderError);
                // Continue even if opening folder fails
            }
        }
        
        // Clear tags
        tags = [];
        displayTags();
        
        // Close the popup after a short delay to show success
        setTimeout(() => {
            window.close();
        }, 1000);
    } catch (error) {
        console.error('Error saving bookmark:', error);
        alert('Error saving bookmark. Please try again.');
    }
}

// Load theme on startup
async function loadTheme() {
    try {
        const result = await chrome.storage.local.get(['theme']);
        const theme = result.theme || 'dark';
        document.body.className = theme;
    } catch (error) {
        console.error('Error loading theme:', error);
    }
}

// Create new folder
async function createNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName || folderName.trim() === '') return;
    
    try {
        const newFolder = await chrome.bookmarks.create({
            parentId: '1', // Bookmarks bar
            title: folderName.trim()
        });
        
        // Add to all folders list
        allFolders.push({
            id: newFolder.id,
            title: newFolder.title,
            parentId: newFolder.parentId
        });
        
        // Select the new folder
        selectedFolder = newFolder;
        document.getElementById('search-folders').value = newFolder.title;
        
        // Refresh the display
        displayFoldersWithRecent();
        
        // Show success message
        const createBtn = document.getElementById('create-folder-btn');
        const originalText = createBtn.textContent;
        createBtn.textContent = '✓';
        createBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        
        setTimeout(() => {
            createBtn.textContent = originalText;
            createBtn.style.background = '';
        }, 1000);
        
    } catch (error) {
        console.error('Error creating folder:', error);
        alert('Error creating folder. Please try again.');
    }
}
