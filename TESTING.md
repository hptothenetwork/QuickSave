# QuickSave v2.0 - Testing Guide

## Pre-Installation Checklist

- [ ] All files present in the QuickSave folder
- [ ] js/ subfolder exists with all module files
- [ ] Chrome/Brave browser updated to latest version
- [ ] Developer mode ready to enable

## Installation Testing

### Step 1: Load Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the QuickSave folder
5. **Expected**: Extension loads without errors
6. **Check**: No error messages in red

### Step 2: Verify Files
1. Click "Details" on the extension card
2. Scroll to "Inspect views"
3. **Expected**: Should show "popup.html"
4. Click "popup.html" to open DevTools
5. **Check**: Console should show "QuickSave initialized successfully"
6. **Check**: No errors in console

## Feature Testing

### Basic Functionality

#### Test 1: Open Popup
- [ ] Click extension icon in toolbar
- [ ] **Expected**: Popup opens with dark theme
- [ ] **Check**: Title shows "QuickSave"
- [ ] **Check**: All UI elements visible

#### Test 2: Auto-fill Current Tab
- [ ] Navigate to any website (e.g., google.com)
- [ ] Open QuickSave popup
- [ ] **Expected**: Name field shows page title
- [ ] **Expected**: URL field shows page URL
- [ ] **Check**: Values are correct

#### Test 3: Folder Display
- [ ] Click on "Search folders..." input
- [ ] **Expected**: Dropdown shows folder list
- [ ] **Expected**: Folders have icons (📁, 💼, etc.)
- [ ] **Expected**: Folder stats show bookmark counts
- [ ] **Check**: Can scroll through list

#### Test 4: Folder Search
- [ ] Type in search box
- [ ] **Expected**: Folders filter as you type
- [ ] **Expected**: Case-insensitive search works
- [ ] **Check**: Empty search shows all folders

#### Test 5: Select Folder
- [ ] Click on a folder
- [ ] **Expected**: Folder gets highlighted
- [ ] **Expected**: Search box shows folder name
- [ ] **Expected**: Dropdown closes
- [ ] **Check**: Folder remains selected

#### Test 6: Save Bookmark
- [ ] Enter or edit bookmark name
- [ ] Verify URL is valid
- [ ] Select a folder
- [ ] Click "Save Bookmark"
- [ ] **Expected**: Success message appears
- [ ] **Expected**: Popup closes after ~1.5 seconds
- [ ] **Check**: Bookmark appears in Chrome bookmarks

### Advanced Features

#### Test 7: Tags System
- [ ] Type a tag in tags input
- [ ] Press Enter or comma
- [ ] **Expected**: Tag appears as chip below input
- [ ] **Expected**: Tag has × remove button
- [ ] [ ] Add multiple tags
- [ ] Click × to remove a tag
- [ ] **Expected**: Tag disappears
- [ ] **Check**: Can add tag again after removing

#### Test 8: Bookmark Notes
- [ ] Click in the notes textarea
- [ ] Type a note (up to 500 characters)
- [ ] **Expected**: Text appears normally
- [ ] **Expected**: Textarea expands if needed
- [ ] Save bookmark with note
- [ ] **Check**: Note is stored (via storage API)

#### Test 9: Duplicate Detection
- [ ] Check "Check for duplicates"
- [ ] Try to save a bookmark that already exists
- [ ] **Expected**: Confirmation dialog appears
- [ ] **Expected**: Shows number of duplicates found
- [ ] Cancel or proceed
- [ ] **Check**: Can still save if desired

#### Test 10: Auto-categorize
- [ ] Check "Auto-categorize"
- [ ] Enter a GitHub URL
- [ ] **Expected**: Suggests folder with 💻 icon
- [ ] Try YouTube URL
- [ ] **Expected**: Suggests folder with 🎬 icon
- [ ] **Check**: Falls back if no match

#### Test 11: Create New Folder
- [ ] Click + button next to folder search
- [ ] **Expected**: Prompt dialog appears
- [ ] Enter "Test Folder"
- [ ] **Expected**: Success notification
- [ ] **Expected**: Folder appears in list
- [ ] **Expected**: New folder is auto-selected
- [ ] **Check**: Can save bookmark to new folder

#### Test 12: Recent Folders
- [ ] Save bookmark to folder A
- [ ] Reopen popup
- [ ] **Expected**: "Recent" section appears
- [ ] **Expected**: Folder A is listed first
- [ ] Save to folder B
- [ ] **Expected**: Folder B now appears first
- [ ] **Check**: Recent shows last 5 folders

#### Test 13: Theme Toggle
- [ ] Click 🌙 button in header
- [ ] **Expected**: Theme switches to light
- [ ] **Expected**: All colors invert
- [ ] Click again
- [ ] **Expected**: Back to dark theme
- [ ] Close and reopen popup
- [ ] **Check**: Theme persists

#### Test 14: Export Data
- [ ] Click 💾 button in header
- [ ] **Expected**: File download starts
- [ ] **Expected**: JSON file named "quicksave-backup-[date].json"
- [ ] Open file in text editor
- [ ] **Check**: Contains version, settings, bookmarks

#### Test 15: Keyboard Shortcuts
- [ ] Press Ctrl+Shift+S anywhere
- [ ] **Expected**: Popup opens
- [ ] Press Esc
- [ ] **Expected**: Popup closes
- [ ] Open popup again
- [ ] Press Ctrl+S
- [ ] **Expected**: Attempts to save (may need folder selected)
- [ ] Use Tab to navigate
- [ ] **Check**: Focus moves between fields

### Accessibility Testing

#### Test 16: Screen Reader (if available)
- [ ] Enable screen reader
- [ ] Navigate through popup
- [ ] **Expected**: Each field has label
- [ ] **Expected**: Folder items announced
- [ ] **Expected**: Buttons have descriptions
- [ ] **Check**: No unlabeled elements

#### Test 17: Keyboard Navigation
- [ ] Use Tab key only (no mouse)
- [ ] Navigate through all fields
- [ ] Press Enter on folder item
- [ ] **Expected**: Folder selects
- [ ] Navigate to Save button
- [ ] Press Space or Enter
- [ ] **Expected**: Saves bookmark
- [ ] **Check**: All interactive elements reachable

#### Test 18: Focus Indicators
- [ ] Tab through interface
- [ ] **Expected**: Blue outline on focused element
- [ ] **Expected**: Outline clearly visible
- [ ] **Check**: No hidden focus states

### Security Testing

#### Test 19: Input Sanitization
- [ ] Try entering HTML: `<script>alert('test')</script>`
- [ ] **Expected**: Script tags removed/escaped
- [ ] Try entering: `javascript:alert('xss')`
- [ ] **Expected**: Invalid URL rejected
- [ ] Try very long input (>500 chars)
- [ ] **Expected**: Input truncated
- [ ] **Check**: No XSS vulnerabilities

#### Test 20: URL Validation
- [ ] Enter invalid URL: "not a url"
- [ ] Try to save
- [ ] **Expected**: Error notification
- [ ] Enter: "ftp://example.com"
- [ ] **Expected**: May be rejected (only http/https/chrome allowed)
- [ ] Enter valid URL
- [ ] **Expected**: Saves successfully
- [ ] **Check**: Only valid URLs accepted

### Error Handling

#### Test 21: Missing Required Fields
- [ ] Leave name blank
- [ ] Try to save
- [ ] **Expected**: Error notification "Please enter both name and URL"
- [ ] Fill name, leave URL blank
- [ ] **Expected**: Same error
- [ ] Leave folder unselected
- [ ] **Expected**: Error "Please select a folder"
- [ ] **Check**: Clear error messages

#### Test 22: Network Errors (if applicable)
- [ ] Test with slow connection
- [ ] **Expected**: Loading state on save button
- [ ] **Expected**: Button shows "Saving..."
- [ ] **Check**: UI doesn't freeze

### Migration Testing

#### Test 23: First-Time Setup
- [ ] Install fresh (or clear storage)
- [ ] Open popup
- [ ] Open DevTools console
- [ ] **Expected**: "Storage initialized"
- [ ] **Check**: No migration errors

#### Test 24: Version Check
- [ ] Check chrome.storage.local
- [ ] **Expected**: storageVersion = "2.0.0"
- [ ] **Check**: All storage keys present

## Performance Testing

#### Test 25: Large Folder List
- [ ] If you have 50+ folders, test search
- [ ] **Expected**: Search is responsive
- [ ] **Expected**: No lag when typing
- [ ] **Check**: Scrolling is smooth

#### Test 26: Many Tags
- [ ] Add 10+ tags
- [ ] **Expected**: All display correctly
- [ ] **Expected**: Can still remove tags
- [ ] **Check**: No UI overflow issues

## Browser Compatibility

#### Test 27: Chrome
- [ ] All tests above pass in Chrome
- [ ] **Check**: Version 88 or higher

#### Test 28: Brave
- [ ] Load extension in Brave
- [ ] Test basic save functionality
- [ ] **Check**: Works identically to Chrome

## Cleanup

#### Test 29: Unload Extension
- [ ] Go to chrome://extensions/
- [ ] Toggle extension off
- [ ] **Expected**: Icon disappears from toolbar
- [ ] Toggle back on
- [ ] **Expected**: Settings persist

#### Test 30: Reload Extension
- [ ] Click refresh icon (🔄) on extension card
- [ ] **Expected**: Extension reloads
- [ ] Open popup
- [ ] **Expected**: Everything works
- [ ] **Check**: No data loss

## Known Limitations

- Cannot rename/move folders (Chrome API limitation)
- Cannot delete bookmarks from extension
- Theme toggle button shows moon emoji (not dynamic)
- Export doesn't include Chrome's bookmark structure
- Tags stored separately from Chrome's bookmark description
- Notes not visible in Chrome's bookmark manager

## Success Criteria

✅ Extension loads without errors
✅ All basic features work
✅ Security measures prevent XSS
✅ Accessibility features functional
✅ Data persists across sessions
✅ Error handling is user-friendly
✅ Performance is acceptable
✅ No console errors during normal use

## Reporting Issues

If you find issues:
1. Note the test number
2. Describe what happened vs. expected
3. Check browser console for errors
4. Include browser version
5. Document steps to reproduce

---

**Testing completed by:** _______________
**Date:** _______________
**Browser:** _______________ Version: _______________
**Result:** ⬜ Pass ⬜ Fail (with notes)
