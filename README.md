# Quick Folder Bookmark - Chrome Extension

A Chrome extension that allows you to quickly save bookmarks to specific folders with search functionality.

## Features

### Core Functionality
- Auto-fills current tab title and URL
- Browse and search through all bookmark folders with smart icons
- Recent folders for quick access
- Keyboard shortcuts (Ctrl+S to save, Esc to close)
- Dark/Light theme toggle
- Quick folder creation from popup

### Advanced Features
- **Bookmark Tags System** - Add custom tags to organize bookmarks
- **Folder Statistics** - Shows bookmark count for each folder
- **Duplicate Detection** - Warns if bookmark already exists
- **Auto-categorization** - Suggests folders based on URL patterns
- **Search History** - Remembers recent searches
- **Smart Defaults** - Remembers last used folder

### UI/UX Features
- Clean, modern interface with gradients and animations
- One-click bookmark saving with visual feedback
- Optional folder opening after saving
- Beautiful UI with hover effects and smooth transitions
- Professional and calm design

## Installation Instructions

### Step 1: Enable Developer Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle the **"Developer mode"** switch in the top-right corner

### Step 2: Load the Extension
1. Click the **"Load unpacked"** button
2. Navigate to your extension folder (containing `manifest.json`, `popup.html`, `style.css`, and `popup.js`)
3. Select the folder and click **"Select Folder"**

### Step 3: Verify Installation
- The extension should appear in your extensions list
- You should see "Quick Folder Bookmark" with version 1.0
- The extension icon should appear in your Brave toolbar

### Step 4: Reload Extension (After Updates)
- After making changes, click the refresh icon next to the extension
- Or remove and reload the extension to apply new permissions

## New Features Guide

### Keyboard Shortcuts
- **Ctrl+S**: Save bookmark
- **Esc**: Close popup

### Recent Folders
- Recently used folders appear at the top of the list
- Automatically updated when you select folders
- Stored locally for persistence

### Theme Toggle
- Click the moon/sun icon in the header to switch themes
- Theme preference is saved automatically
- Supports both dark and light modes

### Quick Folder Creation
- Click the "+" button next to the search field
- Enter folder name when prompted
- New folder is automatically selected

### Advanced Features Guide

#### Bookmark Tags
- Type tags in the "Add tags" field
- Press Enter or comma to add tags
- Tags are saved with bookmarks for better organization
- Click "×" to remove tags

#### Folder Statistics
- Each folder shows bookmark count (e.g., "5 📄")
- Statistics update automatically when bookmarks are added

#### Duplicate Detection
- Check "Check for duplicates" to get warnings
- Confirms before saving duplicate bookmarks

#### Auto-categorization
- Check "Auto-categorize" for smart folder suggestions
- Based on URL patterns (GitHub → Tech, YouTube → Video, etc.)

#### Search History
- Recent searches are automatically saved
- Helps with quick access to frequently searched folders

## Testing the Extension

### Basic Functionality Test
1. Navigate to any website you want to bookmark
2. Click the **Quick Folder Bookmark** extension icon in the toolbar
3. Verify that:
   - The popup opens with the current page title and URL pre-filled
   - Your bookmark folders are displayed in the list
   - You can search through folders using the search bar

### Bookmark Saving Test
1. Select a folder from the list (it should highlight in blue)
2. Optionally modify the bookmark name or URL
3. Optionally check "Open folder after saving" if you want to verify the bookmark
4. Click the **"Save"** button
5. Verify that:
   - The bookmark appears in the selected folder
   - The popup closes automatically
   - If checked, the bookmarks manager opens in a new tab
   - No error messages appear

### Search Functionality Test
1. Type text in the "Search folders..." field
2. Verify that only matching folders are displayed
3. Clear the search field and verify all folders reappear

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the same folder
- Check that `manifest.json` has no syntax errors
- Verify Developer mode is enabled

### Permissions Issues
- The extension requires "bookmarks" permission
- If prompted, click "Allow" when Chrome asks for permissions

### Popup Not Working
- Check the browser console for JavaScript errors
- Ensure all file paths in `popup.html` are correct
- Verify that `popup.js` and `style.css` are in the same folder

### Bookmarks Not Saving
- Make sure you've selected a folder before clicking Save
- Check that both name and URL fields are filled
- Verify the bookmark appears in Chrome's bookmark manager

## File Structure

```
extension-folder/
├── manifest.json    # Extension configuration
├── popup.html       # Popup user interface
├── style.css        # Styling for the popup
├── popup.js         # Extension functionality
└── README.md        # This file
```

## Development Notes

- Built for Chrome Manifest V3
- Uses Chrome Bookmarks API
- Responsive design with dark theme
- No external dependencies required

## Updating the Extension

After making changes to any files:
1. Go to `chrome://extensions/`
2. Find "Quick Folder Bookmark" in the list
3. Click the **refresh/reload** icon
4. Test the changes by clicking the extension icon
