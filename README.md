# QuickSave - Smart Bookmarks Extension v2.1

A powerful and intuitive Chrome extension for managing bookmarks with advanced features like smart categorization, tags, notes, enhanced organization, and now **Extension Search**!

## 🚀 New in Version 2.1

- ✨ **Extension Search Tab** - Search and open all your installed extensions
- 🧩 **Quick Extension Launcher** - Find any extension instantly with search
- 📊 **Extension Statistics** - See how many extensions you have at a glance
- ⚡ **Fast Extension Access** - Open extension options/pages with one click
- 🎯 **Smart Extension Detection** - Automatic categorization of extensions

## 🎉 Features from v2.0

- ✅ **Input Sanitization** - XSS protection and secure data handling
- ✅ **Content Security Policy** - Enhanced security
- ✅ **Version Migration** - Automatic data migration between versions
- ✅ **Modular Architecture** - Clean, maintainable code structure
- ✅ **Bookmark Notes** - Add detailed notes to your bookmarks
- ✅ **Enhanced Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Export/Import** - Backup and restore your bookmark settings
- ✅ **Theme Toggle** - Switch between dark and light themes
- ✅ **Improved Tag Management** - Tags stored separately with search capabilities
- ✅ **Better Error Handling** - User-friendly notifications
- ✅ **URL Validation** - Prevents invalid bookmarks

## Features

### Core Features
- 🚀 **Quick Save** - Save bookmarks with one click
- 🧩 **Extension Search** - Find and open your installed extensions instantly
- 📁 **Smart Folder Search** - Find the right folder instantly
- 🎯 **Auto-fill** - Current page title and URL pre-filled
- ⌨️ **Keyboard Shortcuts** - Ctrl+Shift+S to open, Ctrl+S to save, Esc to close
- 🌙 **Dark/Light Theme** - Toggle between themes with persistence
- 📊 **Folder Stats** - See bookmark counts in real-time
- 🏷️ **Tags Support** - Add and manage custom tags
- 📝 **Bookmark Notes** - Add detailed notes to bookmarks

### Advanced Features
- 🔍 **Duplicate Detection** - Find existing bookmarks before saving
- 🤖 **Auto-categorization** - Smart folder suggestions based on URL
- 📂 **Recent Folders** - Quick access to frequently used folders
- 🔄 **Search History** - Remember your recent searches
- 💾 **Export/Import** - Backup your settings and preferences
- ♿ **Accessibility** - Full keyboard navigation and screen reader support
- 🔒 **Security** - Input sanitization and CSP protection

## Installation

### Method 1: Load Unpacked (Developer Mode)

1. **Download the extension:**
   - Clone this repository or download as ZIP
   - Extract to a permanent location (don't delete after installation)

2. **Install in Chrome/Brave:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the QuickSave folder
   - The extension icon will appear in your toolbar

3. **Pin the extension:**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "QuickSave - Smart Bookmarks"
   - Click the pin icon to keep it visible

### Method 2: Chrome Web Store
*Coming soon - extension will be published to the Chrome Web Store*

## How to Use

### Bookmarks Tab
1. **Navigate** to any webpage you want to bookmark
2. **Click** the QuickSave extension icon (or press Ctrl+Shift+S)
3. **Review** the auto-filled title and URL
4. **Search** for a folder or select from recent folders
5. **Add tags** (optional) - press Enter or comma to add each tag
6. **Add notes** (optional) - detailed information about the bookmark
7. **Click Save** - your bookmark is saved!

### Extensions Tab
1. **Click** the "🧩 Extensions" tab at the top
2. **Browse** all your installed Chrome extensions
3. **Search** for any extension by name
4. **Click** on an extension to open it
5. **Quick Access** - Open extension options or management pages instantly

### Advanced Features

#### Tags
- Add multiple tags separated by commas or Enter key
- Click the × to remove a tag
- Tags are stored separately and searchable

#### Notes
- Add detailed notes up to 500 characters
- Great for context, reminders, or descriptions

#### Duplicate Detection
- Enable "Check for duplicates" to avoid saving the same bookmark twice
- Get notified if a bookmark already exists

#### Auto-categorization
- Enable "Auto-categorize" for smart folder suggestions
- Automatically detects common website types

#### Export/Import
- Click the 💾 icon to export your settings
- Includes preferences, recent folders, and search history
- Backup before major changes

## Keyboard Shortcuts

- `Ctrl + Shift + S` - Open QuickSave popup
- `Ctrl + S` - Save bookmark (when popup is open)
- `Esc` - Close popup
- `Tab` - Navigate between fields
- `Enter` or `Space` - Select folder (when focused)

## File Structure

```
QuickSave/
├── manifest.json           # Extension configuration (v2.1)
├── popup.html             # User interface with tabs
├── popup.js               # Main application logic
├── style.css              # Enhanced styling
├── js/
│   ├── storage.js         # Storage and migration management
│   ├── bookmarks.js       # Bookmark operations
│   ├── extensions.js      # Extension search & management
│   ├── ui.js              # UI management
│   └── utils.js           # Utility functions
├── bookmark_.png          # Extension icon
├── README.md              # This file
└── install_instructions.txt # Quick reference
```

## Troubleshooting

### Extension Not Loading
1. Ensure "Developer mode" is enabled in `chrome://extensions/`
2. Check that all files are in the same folder
3. Try removing and reloading the extension

### Bookmarks Not Saving
1. Check that you have selected a folder
2. Verify the URL is valid (starts with http://, https://, or chrome://)
3. Check browser console for errors (F12)

### Data Migration Issues
1. Export your data first (💾 button)
2. Clear extension storage in `chrome://extensions/`
3. Reload the extension
4. Re-import if needed

## Privacy & Security

- ✅ All data stored locally in your browser
- ✅ No external servers or tracking
- ✅ Input sanitization prevents XSS attacks
- ✅ Content Security Policy enforced
- ✅ No data collection or analytics
- ✅ Open source - inspect the code yourself

## Development

### Architecture
- **Modular Design**: Separated concerns (storage, bookmarks, UI, utils)
- **ES6 Modules**: Clean imports and exports
- **Async/Await**: Modern asynchronous code
- **Event-Driven**: Efficient event handling
- **Accessibility-First**: ARIA labels and keyboard navigation

### Technologies
- Manifest V3
- Vanilla JavaScript (ES6+)
- Chrome Extension APIs
- CSS3 with animations
- LocalStorage for persistence

## Browser Compatibility

- ✅ Chrome (v88+)
- ✅ Brave
- ✅ Edge (Chromium-based)
- ❌ Firefox (Manifest V3 support required)
- ❌ Safari (Different extension format)

## Version History

### v2.1.0 (2025-10-05)
- **NEW:** Extension Search tab - Find and open all installed extensions
- Added chrome.management API integration
- Extension statistics display
- Quick extension launcher
- Search extensions by name or description
- One-click access to extension options/pages
- Beautiful extension cards with icons
- Tab-based navigation (Bookmarks | Extensions)

### v2.0.0 (2025-10-04)
- Complete architecture overhaul
- Added modular JavaScript structure
- Input sanitization and security improvements
- Version migration system
- Enhanced accessibility (ARIA, keyboard navigation)
- Bookmark notes feature
- Export/Import functionality
- Theme toggle in UI
- Better tag management
- Improved error handling
- Content Security Policy

### v1.0.0
- Initial release
- Basic bookmark saving
- Folder search
- Tags system
- Dark/light theme
- Recent folders

## Contributing

Contributions are welcome! This is an open-source project.

### Areas for Improvement
- Unit tests
- Internationalization (i18n)
- Bookmark sync across devices
- Folder management (rename, delete, move)
- Advanced search and filtering
- Bookmark sorting options

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review browser console errors (F12)
3. Open an issue on GitHub
4. Include browser version and error details

## License

This project is open source. Feel free to use, modify, and distribute.

---

**Made with ❤️ for better bookmark management**

*QuickSave v2.0 - Smart, Secure, Accessible*
