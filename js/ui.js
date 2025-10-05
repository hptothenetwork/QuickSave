// UI management for QuickSave extension
import { getFolderIcon, showNotification } from './utils.js';

// Display folders in the list
export function displayFolders(foldersToShow, folderStats, containerElement) {
    containerElement.innerHTML = '';
    
    foldersToShow.forEach(folder => {
        const folderElement = createFolderElement(folder, 'all', folderStats);
        containerElement.appendChild(folderElement);
    });
}

// Display folders with recent section
export function displayFoldersWithRecent(allFolders, recentFolders, folderStats, containerElement, onSelect) {
    containerElement.innerHTML = '';
    
    // Add recent folders section if there are recent folders
    if (recentFolders.length > 0) {
        const recentSection = document.createElement('div');
        recentSection.className = 'folder-section';
        recentSection.innerHTML = '<div class="section-title">Recent</div>';
        
        recentFolders.forEach(folder => {
            const folderElement = createFolderElement(folder, 'recent', folderStats, onSelect);
            recentSection.appendChild(folderElement);
        });
        
        containerElement.appendChild(recentSection);
        
        // Add separator
        const separator = document.createElement('div');
        separator.className = 'folder-separator';
        containerElement.appendChild(separator);
    }
    
    // Add all folders
    allFolders.forEach(folder => {
        const folderElement = createFolderElement(folder, 'all', folderStats, onSelect);
        containerElement.appendChild(folderElement);
    });
}

// Create folder element
export function createFolderElement(folder, type, folderStats, onSelect) {
    const folderElement = document.createElement('div');
    folderElement.className = `folder-item ${type}`;
    folderElement.dataset.folderId = folder.id;
    folderElement.setAttribute('role', 'button');
    folderElement.setAttribute('tabindex', '0');
    folderElement.setAttribute('aria-label', `Select folder ${folder.title}`);
    
    // Create folder content
    const folderContent = document.createElement('div');
    folderContent.className = 'folder-item-content';
    
    // Create icon span
    const iconSpan = document.createElement('span');
    iconSpan.className = 'folder-icon';
    iconSpan.textContent = getFolderIcon(folder.title);
    iconSpan.setAttribute('aria-hidden', 'true');
    
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
    statsSpan.setAttribute('aria-label', `${stats.bookmarks} bookmarks`);
    
    folderElement.appendChild(folderContent);
    folderElement.appendChild(statsSpan);
    
    // Click handler
    if (onSelect) {
        folderElement.addEventListener('click', () => onSelect(folderElement, folder));
        
        // Keyboard support
        folderElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(folderElement, folder);
            }
        });
    }
    
    return folderElement;
}

// Select a folder
export function selectFolder(element, folder, searchInputElement, foldersListElement) {
    // Remove previous selection
    document.querySelectorAll('.folder-item').forEach(item => {
        item.classList.remove('selected');
        item.setAttribute('aria-selected', 'false');
    });
    
    // Add selection to clicked folder
    element.classList.add('selected');
    element.setAttribute('aria-selected', 'true');
    
    // Update search input with selected folder name
    if (searchInputElement) {
        searchInputElement.value = folder.title;
    }
    
    // Hide the dropdown
    if (foldersListElement) {
        foldersListElement.classList.remove('show');
    }
    
    return folder;
}

// Display tags
export function displayTags(tags, containerElement, onRemove) {
    containerElement.innerHTML = '';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.setAttribute('role', 'button');
        tagElement.setAttribute('aria-label', `Tag: ${tag}. Press delete to remove`);
        
        const tagText = document.createElement('span');
        tagText.textContent = tag;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'tag-remove';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove tag ${tag}`);
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            onRemove(tag);
        };
        
        tagElement.appendChild(tagText);
        tagElement.appendChild(removeBtn);
        containerElement.appendChild(tagElement);
    });
}

// Show success message on save button
export function showSaveSuccess(buttonElement, folderName) {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = `Saved to ${folderName}!`;
    buttonElement.classList.add('success');
    buttonElement.setAttribute('aria-live', 'polite');
    
    setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.classList.remove('success');
    }, 2000);
}

// Update button state
export function setButtonLoading(buttonElement, isLoading) {
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.dataset.originalText = buttonElement.textContent;
        buttonElement.textContent = 'Saving...';
        buttonElement.classList.add('loading');
    } else {
        buttonElement.disabled = false;
        buttonElement.textContent = buttonElement.dataset.originalText || 'Save';
        buttonElement.classList.remove('loading');
    }
}

// Show error message
export function showError(message) {
    showNotification(message, 'error', 3000);
}

// Show success message
export function showSuccess(message) {
    showNotification(message, 'success', 2000);
}

// Show info message
export function showInfo(message) {
    showNotification(message, 'info', 2500);
}

// Create modal dialog
export function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modal-title';
    modalTitle.textContent = title;
    modalHeader.appendChild(modalTitle);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    if (typeof content === 'string') {
        modalBody.innerHTML = content;
    } else {
        modalBody.appendChild(content);
    }
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = `modal-btn ${btn.type || 'secondary'}`;
        button.textContent = btn.text;
        button.onclick = () => {
            if (btn.onClick) btn.onClick();
            closeModal(modal);
        };
        modalFooter.appendChild(button);
    });
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    document.body.appendChild(modal);
    
    // Focus first button
    setTimeout(() => {
        const firstBtn = modalFooter.querySelector('button');
        if (firstBtn) firstBtn.focus();
    }, 100);
    
    return modal;
}

// Close modal
export function closeModal(modal) {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Create breadcrumb navigation
export function createBreadcrumb(folders, currentFolder) {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('role', 'navigation');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    
    const path = [];
    let folder = currentFolder;
    
    // Build path from current to root
    while (folder && folder.parentId) {
        path.unshift(folder);
        folder = folders.find(f => f.id === folder.parentId);
    }
    
    // Create breadcrumb items
    path.forEach((f, index) => {
        const item = document.createElement('span');
        item.className = 'breadcrumb-item';
        item.textContent = f.title;
        
        if (index < path.length - 1) {
            item.classList.add('clickable');
            item.onclick = () => {
                // Navigate to this folder
                console.log('Navigate to:', f.title);
            };
        }
        
        breadcrumb.appendChild(item);
        
        if (index < path.length - 1) {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = ' / ';
            separator.setAttribute('aria-hidden', 'true');
            breadcrumb.appendChild(separator);
        }
    });
    
    return breadcrumb;
}

// Toggle theme
export function applyTheme(theme) {
    document.body.className = theme;
    document.body.setAttribute('data-theme', theme);
}

// Filter folders by search term
export function filterFolders(folders, searchTerm) {
    if (!searchTerm.trim()) {
        return folders;
    }
    
    const term = searchTerm.toLowerCase();
    return folders.filter(folder =>
        folder.title.toLowerCase().includes(term)
    );
}

// Highlight search term in text
export function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Display bookmark search results
export function displayBookmarkSearchResults(bookmarks, searchTerm, containerElement) {
    containerElement.innerHTML = '';
    
    if (bookmarks.length === 0) {
        containerElement.innerHTML = `
            <div class="no-results">
                <span class="no-results-icon">🔍</span>
                <p>No bookmarks found for "${searchTerm}"</p>
                <small>Try a different search term</small>
            </div>
        `;
        containerElement.hidden = false;
        return;
    }
    
    // Add results header
    const header = document.createElement('div');
    header.className = 'search-results-header';
    header.innerHTML = `
        <span class="results-count">Found ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}</span>
        <button class="clear-search-btn" id="clear-bookmark-search" aria-label="Clear search">✕</button>
    `;
    containerElement.appendChild(header);
    
    // Add results list
    const resultsList = document.createElement('div');
    resultsList.className = 'bookmark-results-list';
    resultsList.setAttribute('role', 'list');
    
    bookmarks.forEach(bookmark => {
        const resultCard = createBookmarkResultCard(bookmark, searchTerm);
        resultsList.appendChild(resultCard);
    });
    
    containerElement.appendChild(resultsList);
    containerElement.hidden = false;
}

// Create bookmark result card
export function createBookmarkResultCard(bookmark, searchTerm) {
    const card = document.createElement('div');
    card.className = 'bookmark-result-card';
    card.setAttribute('role', 'listitem');
    card.dataset.bookmarkId = bookmark.id;
    
    // Extract domain from URL for favicon
    let domain = '';
    try {
        const url = new URL(bookmark.url);
        domain = url.hostname;
    } catch (e) {
        domain = '';
    }
    
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
    
    // Highlight matching text
    const highlightedTitle = highlightSearchTerm(bookmark.title, searchTerm);
    const highlightedUrl = highlightSearchTerm(bookmark.url, searchTerm);
    
    card.innerHTML = `
        <div class="bookmark-result-icon">
            ${faviconUrl ? `<img src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : '🔖'}
        </div>
        <div class="bookmark-result-info">
            <div class="bookmark-result-title">${highlightedTitle}</div>
            <div class="bookmark-result-url">${highlightedUrl}</div>
            ${bookmark.folderPath ? `<div class="bookmark-result-folder" data-folder-id="${bookmark.parentId}">${bookmark.folderPath}</div>` : ''}
        </div>
        <div class="bookmark-result-actions">
            <button class="bookmark-action-btn open-bookmark-btn" data-url="${bookmark.url}" title="Open bookmark" aria-label="Open ${bookmark.title}">
                🔗
            </button>
        </div>
    `;
    
    // Add click handler to open bookmark on the entire card
    card.addEventListener('click', (e) => {
        // Don't open bookmark if clicking on folder or button
        if (!e.target.closest('.bookmark-result-folder') && !e.target.closest('.bookmark-action-btn')) {
            chrome.tabs.create({ url: bookmark.url });
        }
    });
    
    // Folder click handler - show folder contents
    const folderElement = card.querySelector('.bookmark-result-folder');
    if (folderElement && bookmark.parentId) {
        folderElement.style.cursor = 'pointer';
        folderElement.addEventListener('click', (e) => {
            e.stopPropagation();
            // Trigger custom event to show folder bookmarks
            const event = new CustomEvent('showFolderBookmarks', { 
                detail: { 
                    folderId: bookmark.parentId,
                    folderPath: bookmark.folderPath 
                } 
            });
            document.dispatchEvent(event);
        });
    }
    
    // Open button click handler
    const openBtn = card.querySelector('.open-bookmark-btn');
    openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.tabs.create({ url: bookmark.url });
    });
    
    // Keyboard support for the card
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            chrome.tabs.create({ url: bookmark.url });
        }
    });
    
    return card;
}

// Clear bookmark search results
export function clearBookmarkSearchResults(containerElement, searchInputElement) {
    containerElement.innerHTML = '';
    containerElement.hidden = true;
    if (searchInputElement) {
        searchInputElement.value = '';
        searchInputElement.focus();
    }
}

// Display folder bookmarks in a modal
export async function displayFolderBookmarks(folderId, folderPath, bookmarksModule) {
    try {
        // Get bookmarks in folder
        const bookmarks = await bookmarksModule.getBookmarksInFolder(folderId);
        
        if (bookmarks.length === 0) {
            showInfo(`No bookmarks found in "${folderPath}"`);
            return;
        }
        
        // Create modal content
        const content = document.createElement('div');
        content.className = 'folder-bookmarks-content';
        
        const header = document.createElement('div');
        header.className = 'folder-bookmarks-header';
        header.innerHTML = `
            <div class="folder-bookmarks-path">📁 ${folderPath}</div>
            <div class="folder-bookmarks-count">${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}</div>
        `;
        content.appendChild(header);
        
        // Create bookmarks list
        const list = document.createElement('div');
        list.className = 'folder-bookmarks-list';
        
        bookmarks.forEach(bookmark => {
            const item = createFolderBookmarkItem(bookmark);
            list.appendChild(item);
        });
        
        content.appendChild(list);
        
        // Create modal
        const modal = createModal(
            `Folder: ${folderPath}`,
            content,
            [
                {
                    text: 'Close',
                    type: 'secondary',
                    onClick: () => {}
                }
            ]
        );
        
        return modal;
    } catch (error) {
        console.error('Error displaying folder bookmarks:', error);
        showError('Failed to load folder bookmarks');
    }
}

// Create folder bookmark item
export function createFolderBookmarkItem(bookmark) {
    const item = document.createElement('div');
    item.className = 'folder-bookmark-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    
    // Extract domain for favicon
    let domain = '';
    try {
        const url = new URL(bookmark.url);
        domain = url.hostname;
    } catch (e) {
        domain = '';
    }
    
    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
    
    item.innerHTML = `
        <div class="folder-bookmark-icon">
            ${faviconUrl ? `<img src="${faviconUrl}" alt="" onerror="this.style.display='none'">` : '🔖'}
        </div>
        <div class="folder-bookmark-info">
            <div class="folder-bookmark-title">${bookmark.title}</div>
            <div class="folder-bookmark-url">${bookmark.url}</div>
        </div>
        <button class="folder-bookmark-open-btn" aria-label="Open ${bookmark.title}">
            🔗
        </button>
    `;
    
    // Click handler
    const openBtn = item.querySelector('.folder-bookmark-open-btn');
    openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.tabs.create({ url: bookmark.url });
    });
    
    item.addEventListener('click', () => {
        chrome.tabs.create({ url: bookmark.url });
    });
    
    // Keyboard support
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            chrome.tabs.create({ url: bookmark.url });
        }
    });
    
    return item;
}

