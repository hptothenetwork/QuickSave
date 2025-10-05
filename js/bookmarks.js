// Bookmark operations for QuickSave extension
import { sanitizeInput, sanitizeUrl, isValidUrl } from './utils.js';
import { saveBookmarkTags, saveBookmarkNote } from './storage.js';

// Get current tab info
export async function getCurrentTabInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return {
            title: tab.title || '',
            url: tab.url || '',
            favIconUrl: tab.favIconUrl || ''
        };
    } catch (error) {
        console.error('Error getting tab info:', error);
        return { title: '', url: '', favIconUrl: '' };
    }
}

// Load bookmark tree
export async function loadBookmarkTree() {
    try {
        return await chrome.bookmarks.getTree();
    } catch (error) {
        console.error('Error loading bookmark tree:', error);
        return [];
    }
}

// Extract all folders from bookmark tree
export function extractFolders(nodes, folders = []) {
    for (const node of nodes) {
        if (node.children) {
            // This is a folder
            folders.push({
                id: node.id,
                title: node.title || 'Bookmarks',
                parentId: node.parentId,
                dateAdded: node.dateAdded
            });
            
            // Recursively find folders in children
            extractFolders(node.children, folders);
        }
    }
    return folders;
}

// Calculate folder statistics
export async function calculateFolderStats(folders) {
    const stats = {};
    
    try {
        for (const folder of folders) {
            const children = await chrome.bookmarks.getChildren(folder.id);
            const bookmarkCount = children.filter(child => child.url).length;
            const subfolderCount = children.filter(child => child.children).length;
            stats[folder.id] = {
                bookmarks: bookmarkCount,
                subfolders: subfolderCount,
                total: children.length
            };
        }
    } catch (error) {
        console.error('Error calculating folder stats:', error);
    }
    
    return stats;
}

// Check for duplicate bookmarks
export async function checkForDuplicates(url) {
    try {
        const allBookmarks = await chrome.bookmarks.search({ url: url });
        return allBookmarks.length > 0 ? allBookmarks : null;
    } catch (error) {
        console.error('Error checking for duplicates:', error);
        return null;
    }
}

// Create bookmark
export async function createBookmark(parentId, title, url, tags = [], note = '') {
    try {
        // Validate and sanitize inputs
        const sanitizedTitle = sanitizeInput(title);
        const sanitizedUrl = sanitizeUrl(url);
        
        if (!sanitizedTitle || !sanitizedUrl) {
            throw new Error('Title and URL are required');
        }
        
        if (!isValidUrl(sanitizedUrl)) {
            throw new Error('Invalid URL format');
        }
        
        // Create the bookmark
        const bookmark = await chrome.bookmarks.create({
            parentId: parentId,
            title: sanitizedTitle,
            url: sanitizedUrl
        });
        
        // Save tags if provided
        if (tags.length > 0) {
            const sanitizedTags = tags.map(tag => sanitizeInput(tag)).filter(tag => tag);
            await saveBookmarkTags(bookmark.id, sanitizedTags);
        }
        
        // Save note if provided
        if (note.trim()) {
            const sanitizedNote = sanitizeInput(note);
            await saveBookmarkNote(bookmark.id, sanitizedNote);
        }
        
        return bookmark;
    } catch (error) {
        console.error('Error creating bookmark:', error);
        throw error;
    }
}

// Create new folder
export async function createFolder(parentId, folderName) {
    try {
        const sanitizedName = sanitizeInput(folderName);
        
        if (!sanitizedName) {
            throw new Error('Folder name is required');
        }
        
        const newFolder = await chrome.bookmarks.create({
            parentId: parentId,
            title: sanitizedName
        });
        
        return {
            id: newFolder.id,
            title: newFolder.title,
            parentId: newFolder.parentId
        };
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
}

// Get bookmark by ID
export async function getBookmark(bookmarkId) {
    try {
        const bookmarks = await chrome.bookmarks.get(bookmarkId);
        return bookmarks[0] || null;
    } catch (error) {
        console.error('Error getting bookmark:', error);
        return null;
    }
}

// Update bookmark
export async function updateBookmark(bookmarkId, changes) {
    try {
        if (changes.title) {
            changes.title = sanitizeInput(changes.title);
        }
        if (changes.url) {
            changes.url = sanitizeUrl(changes.url);
        }
        
        await chrome.bookmarks.update(bookmarkId, changes);
        return true;
    } catch (error) {
        console.error('Error updating bookmark:', error);
        return false;
    }
}

// Delete bookmark
export async function deleteBookmark(bookmarkId) {
    try {
        await chrome.bookmarks.remove(bookmarkId);
        return true;
    } catch (error) {
        console.error('Error deleting bookmark:', error);
        return false;
    }
}

// Move bookmark to folder
export async function moveBookmark(bookmarkId, destinationFolderId) {
    try {
        await chrome.bookmarks.move(bookmarkId, { parentId: destinationFolderId });
        return true;
    } catch (error) {
        console.error('Error moving bookmark:', error);
        return false;
    }
}

// Search bookmarks
export async function searchBookmarks(query) {
    try {
        return await chrome.bookmarks.search(query);
    } catch (error) {
        console.error('Error searching bookmarks:', error);
        return [];
    }
}

// Get bookmarks in folder
export async function getBookmarksInFolder(folderId) {
    try {
        const children = await chrome.bookmarks.getChildren(folderId);
        return children.filter(child => child.url); // Only return bookmarks, not folders
    } catch (error) {
        console.error('Error getting bookmarks in folder:', error);
        return [];
    }
}

// Export bookmarks from a folder
export async function exportFolderBookmarks(folderId) {
    try {
        const folder = await getBookmark(folderId);
        const bookmarks = await getBookmarksInFolder(folderId);
        
        return {
            folderName: folder.title,
            bookmarks: bookmarks.map(b => ({
                title: b.title,
                url: b.url,
                dateAdded: b.dateAdded
            }))
        };
    } catch (error) {
        console.error('Error exporting folder bookmarks:', error);
        return null;
    }
}

// Bulk delete bookmarks
export async function bulkDeleteBookmarks(bookmarkIds) {
    const results = { success: [], failed: [] };
    
    for (const id of bookmarkIds) {
        try {
            await chrome.bookmarks.remove(id);
            results.success.push(id);
        } catch (error) {
            console.error(`Error deleting bookmark ${id}:`, error);
            results.failed.push(id);
        }
    }
    
    return results;
}

// Bulk move bookmarks
export async function bulkMoveBookmarks(bookmarkIds, destinationFolderId) {
    const results = { success: [], failed: [] };
    
    for (const id of bookmarkIds) {
        try {
            await chrome.bookmarks.move(id, { parentId: destinationFolderId });
            results.success.push(id);
        } catch (error) {
            console.error(`Error moving bookmark ${id}:`, error);
            results.failed.push(id);
        }
    }
    
    return results;
}

// Search all bookmarks by title and URL
export async function searchAllBookmarks(query) {
    if (!query || query.trim().length === 0) {
        return [];
    }
    
    try {
        const searchTerm = query.trim().toLowerCase();
        const tree = await loadBookmarkTree();
        const allBookmarks = [];
        
        // Recursively collect all bookmarks with folder path
        function collectBookmarks(nodes, folderPath = []) {
            for (const node of nodes) {
                if (node.url) {
                    // This is a bookmark
                    allBookmarks.push({
                        id: node.id,
                        title: node.title || 'Untitled',
                        url: node.url,
                        parentId: node.parentId,
                        folderPath: folderPath.join(' > '),
                        dateAdded: node.dateAdded
                    });
                } else if (node.children) {
                    // This is a folder, recurse into it
                    const newPath = node.title ? [...folderPath, node.title] : folderPath;
                    collectBookmarks(node.children, newPath);
                }
            }
        }
        
        collectBookmarks(tree);
        
        // Filter bookmarks that match the search term
        const matchingBookmarks = allBookmarks.filter(bookmark => {
            const titleMatch = bookmark.title.toLowerCase().includes(searchTerm);
            const urlMatch = bookmark.url.toLowerCase().includes(searchTerm);
            return titleMatch || urlMatch;
        });
        
        return matchingBookmarks;
    } catch (error) {
        console.error('Error searching bookmarks:', error);
        return [];
    }
}

// Get folder name by ID
export async function getFolderName(folderId) {
    try {
        const folder = await getBookmark(folderId);
        return folder ? folder.title : 'Unknown Folder';
    } catch (error) {
        console.error('Error getting folder name:', error);
        return 'Unknown Folder';
    }
}
