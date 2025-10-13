// Chrome storage management functions

/**
 * Saves an article to Chrome local storage
 * @param {string} videoId - The YouTube video ID
 * @param {Object} articleData - The article data to save
 * @returns {Promise<boolean>} - Success status
 */
async function saveArticle(videoId, articleData) {
    const storageKey = `article_${videoId}`;
    const articleToSave = {
        ...articleData,
        savedAt: new Date().toISOString(),
        videoId: videoId
    };
    
    try {
        await chrome.storage.local.set({ [storageKey]: articleToSave });
        console.log("💾 Article saved for video:", videoId);
        return true;
    } catch (error) {
        console.error("❌ Error saving article:", error);
        return false;
    }
}

/**
 * Retrieves a saved article by video ID
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<Object|null>} - The saved article data or null
 */
async function getSavedArticle(videoId) {
    const storageKey = `article_${videoId}`;
    try {
        const result = await chrome.storage.local.get([storageKey]);
        return result[storageKey] || null;
    } catch (error) {
        console.error("❌ Error retrieving saved article:", error);
        return null;
    }
}

/**
 * Retrieves all saved articles
 * @returns {Promise<Object>} - Object with video IDs as keys and articles as values
 */
async function getAllSavedArticles() {
    try {
        const result = await chrome.storage.local.get(null);
        const articles = {};
        
        for (const [key, value] of Object.entries(result)) {
            if (key.startsWith('article_')) {
                const videoId = key.replace('article_', '');
                articles[videoId] = value;
            }
        }
        
        return articles;
    } catch (error) {
        console.error("❌ Error retrieving all saved articles:", error);
        return {};
    }
}

/**
 * Deletes a saved article by video ID
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteSavedArticle(videoId) {
    const storageKey = `article_${videoId}`;
    try {
        await chrome.storage.local.remove([storageKey]);
        console.log("🗑️ Article deleted for video:", videoId);
        return true;
    } catch (error) {
        console.error("❌ Error deleting article:", error);
        return false;
    }
}

/**
 * Clears all saved articles
 * @returns {Promise<boolean>} - Success status
 */
async function clearAllSavedArticles() {
    try {
        const result = await chrome.storage.local.get(null);
        const articleKeys = Object.keys(result).filter(key => key.startsWith('article_'));
        
        if (articleKeys.length > 0) {
            await chrome.storage.local.remove(articleKeys);
            console.log("🗑️ All articles cleared:", articleKeys.length);
        }
        return true;
    } catch (error) {
        console.error("❌ Error clearing all articles:", error);
        return false;
    }
}
