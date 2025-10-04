# QuickSave v2.0 - Quick Start Guide

## 🚀 Installation (5 minutes)

### Step-by-Step:

1. **Open Chrome Extension Settings**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Look at the top-right corner
   - Toggle the "Developer mode" switch to ON

3. **Load the Extension**
   - Click "Load unpacked" button (appears after enabling dev mode)
   - Navigate to this folder: `E:\CompletedProjects\QuickSave`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "QuickSave - Smart Bookmarks" card
   - Status should be: ON (blue toggle)
   - No errors in red text

5. **Pin to Toolbar (Recommended)**
   - Click the puzzle piece icon (🧩) in Chrome toolbar
   - Find "QuickSave - Smart Bookmarks"
   - Click the pin icon 📌

## ✅ Quick Test (2 minutes)

1. **Open the Extension**
   - Click the QuickSave icon in toolbar
   - OR press `Ctrl+Shift+S`

2. **Verify It Works**
   - ✅ Popup opens
   - ✅ Current page title appears in "Name" field
   - ✅ Current URL appears in "URL" field
   - ✅ Dark theme is active

3. **Test Saving a Bookmark**
   - Click on "Search folders..." field
   - Select any folder from the list
   - Click "Save Bookmark"
   - ✅ Success message appears
   - ✅ Popup closes automatically

4. **Verify Bookmark Was Saved**
   - Open Chrome bookmarks: `Ctrl+Shift+O`
   - OR go to: `chrome://bookmarks/`
   - Find the folder you selected
   - ✅ Your bookmark should be there!

## 🎯 First Use

### Try These Features:

1. **Tags**
   - Type a tag like "work"
   - Press Enter or comma
   - See the tag chip appear
   - Click × to remove

2. **Notes**
   - Click in the "Add a note" field
   - Type any reminder or context
   - Save the bookmark
   - (Note: stored separately, not in Chrome's bookmark manager)

3. **Theme Toggle**
   - Click the 🌙 button in the header
   - Watch the theme switch to light mode
   - Click again to return to dark
   - Close and reopen - theme persists!

4. **Create Folder**
   - Click the + button next to folder search
   - Enter a name like "Test Folder"
   - Folder created and auto-selected!

## 🔧 Troubleshooting

### Extension Not Loading?
```
❌ Problem: Error when loading unpacked
✅ Solution: 
   1. Make sure ALL files are present
   2. Check that js/ folder exists with 4 .js files
   3. Try refreshing: chrome://extensions/ > 🔄 button
```

### Popup Not Opening?
```
❌ Problem: Nothing happens when clicking icon
✅ Solution:
   1. Check extension is ON (blue toggle)
   2. Try right-click icon > "QuickSave - Smart Bookmarks"
   3. Check for errors: Click "Errors" on extension card
```

### Bookmarks Not Saving?
```
❌ Problem: Click save but nothing happens
✅ Solution:
   1. Make sure you selected a folder
   2. Check URL is valid (starts with http:// or https://)
   3. Look for error notification (red box at top)
   4. Open DevTools: Right-click popup > Inspect
   5. Check Console tab for errors
```

### Console Shows Errors?
```
❌ Problem: Red errors in console
✅ Common fixes:
   1. "Cannot find module" → Check js/ folder exists
   2. "Storage error" → Try clearing: chrome://extensions/ > Details > Clear storage
   3. "Permission denied" → Reinstall extension
```

## 📊 Check Everything Is Working

### Open DevTools Console:
1. Right-click the QuickSave popup
2. Select "Inspect"
3. Click "Console" tab

### You Should See:
```
QuickSave initialized successfully
```

### You Should NOT See:
- ❌ Red error messages
- ❌ "Failed to load module"
- ❌ "Permission denied"
- ❌ "Cannot read property"

## 🎨 Customization

### Change Default Settings:
1. Open popup
2. Check/uncheck:
   - ✅ Check for duplicates (recommended)
   - ⬜ Auto-categorize (optional)
   - ⬜ Open folder after saving (optional)
3. Settings save automatically!

### Export Your Settings:
1. Click 💾 button in header
2. JSON file downloads
3. Keep as backup!

## 🎓 Advanced Usage

### Keyboard Shortcuts:
- `Ctrl+Shift+S` - Open popup
- `Ctrl+S` - Save bookmark
- `Esc` - Close popup
- `Tab` - Navigate fields
- `Enter` - Select folder (when focused)

### Quick Workflow:
1. Browse to interesting page
2. Press `Ctrl+Shift+S`
3. Type folder name in search
4. Select folder with arrow keys + Enter
5. Press `Ctrl+S` to save
6. Done in 3 seconds! ⚡

## 📝 File Checklist

Make sure you have these files:

```
E:\CompletedProjects\QuickSave\
├── ✅ manifest.json
├── ✅ popup.html
├── ✅ popup.js
├── ✅ style.css
├── ✅ bookmark_.png
├── ✅ README.md
├── ✅ install_instructions.txt
├── ✅ TESTING.md
└── js/
    ├── ✅ storage.js
    ├── ✅ bookmarks.js
    ├── ✅ ui.js
    └── ✅ utils.js
```

## 🎉 Success!

If you can:
- ✅ Open the popup
- ✅ See your current page info
- ✅ Select a folder
- ✅ Save a bookmark
- ✅ Find it in Chrome bookmarks

**You're all set! Enjoy QuickSave v2.0!** 🚀

## 🆘 Still Having Issues?

1. **Check browser console** - Most errors show there
2. **Review TESTING.md** - Comprehensive test guide
3. **Read README.md** - Full documentation
4. **Check manifest.json** - Should show version "2.0.0"

## 💡 Pro Tips

1. **Pin Recent Folders**: Save to same folders repeatedly to build your "Recent" list
2. **Use Tags**: Great for finding bookmarks later (search by tag)
3. **Add Notes**: Future you will thank present you for context
4. **Export Regularly**: Backup your settings before updates
5. **Theme Toggle**: Match your OS theme for comfort

---

**Need more help?** Open an issue on GitHub or check browser console for errors.

**Enjoying QuickSave?** Star the repo and share with friends! ⭐
