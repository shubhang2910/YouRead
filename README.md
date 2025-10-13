This project includes content or code that was partially generated or assisted by artificial intelligence tools.
All AI-generated content has been reviewed, verified, and modified as needed by the project author to ensure accuracy, quality, and compliance with the project’s goals and ethical standards.

# YouRead Extension - JavaScript Modules

This directory contains the modular JavaScript files for the YouRead Chrome extension popup.

## File Structure

### 📁 **js/formatters.js**
- **Purpose**: Markdown content formatting and HTML generation
- **Functions**:
  - `formatArticleContent(content)` - Converts markdown to HTML
  - `formatInlineMarkdown(text)` - Formats inline markdown elements
  - `formatTable(rows)` - Converts markdown tables to HTML

### 📁 **js/storage.js**
- **Purpose**: Chrome storage management for articles
- **Functions**:
  - `saveArticle(videoId, articleData)` - Saves article to local storage
  - `getSavedArticle(videoId)` - Retrieves saved article by video ID
  - `getAllSavedArticles()` - Gets all saved articles
  - `deleteSavedArticle(videoId)` - Deletes specific article
  - `clearAllSavedArticles()` - Clears all saved articles

### 📁 **js/export.js**
- **Purpose**: Article download and export functionality
- **Functions**:
  - `downloadArticle(articleData, format)` - Downloads article as PDF/DOCX
  - `openArticleInNewWindow(articleData)` - Opens article in new browser window

### 📁 **js/api.js**
- **Purpose**: API communication and data extraction
- **Functions**:
  - `extractVideoData()` - Extracts data from YouTube page
  - `generateArticle(videoData)` - Generates article using AI API

### 📁 **js/ui.js**
- **Purpose**: UI management and event handling
- **Functions**:
  - `showActionButtons(show)` - Shows/hides action buttons
  - `displayArticle(articleData, isSaved)` - Displays article in UI
  - `displayLoading(message)` - Shows loading state
  - `displayError(message)` - Shows error messages
  - `displayInfo(message)` - Shows info messages
  - `initializeEventListeners()` - Sets up all button event listeners

### 📁 **popup.js**
- **Purpose**: Main entry point and coordination
- **Functions**:
  - `initializePopup()` - Initializes the entire popup

## Dependencies

The files are loaded in this order in `popup.html`:
1. `js/formatters.js` - Core formatting functions
2. `js/storage.js` - Storage utilities
3. `js/export.js` - Export functionality (depends on formatters)
4. `js/api.js` - API communication
5. `js/ui.js` - UI management (depends on all above)
6. `popup.js` - Main entry point (depends on ui.js)

## Benefits of This Structure

- **Maintainability**: Each file has a single responsibility
- **Reusability**: Functions can be easily imported where needed
- **Testing**: Easier to unit test individual modules
- **Collaboration**: Multiple developers can work on different modules
- **Debugging**: Easier to locate and fix issues
- **Performance**: Clear separation of concerns

## Usage

The popup automatically initializes when loaded. All modules are available globally and can be used by other parts of the extension if needed.
