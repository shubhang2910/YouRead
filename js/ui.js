// UI management and event handlers

// Global variable to store current article data
let currentArticleData = null;

/**
 * Shows or hides the action buttons based on whether an article is displayed
 * @param {boolean} show - Whether to show the buttons
 */
function showActionButtons(show) {
    document.getElementById("downloadArticle").style.display = show ? "block" : "none";
    document.getElementById("openInWindow").style.display = show ? "block" : "none";
}

/**
 * Displays an article in the output area
 * @param {Object} articleData - The article data to display
 * @param {boolean} isSaved - Whether this is a saved article
 */
function displayArticle(articleData, isSaved = false) {
    currentArticleData = articleData;
    showActionButtons(true);
    
    const saveDate = isSaved ? new Date(articleData.savedAt).toLocaleString() : new Date().toLocaleString();
    const saveIcon = isSaved ? "&#128190;" : "&#10024;";
    
    document.getElementById("output").innerHTML = 
        `<div class="article-container">
            <div class="article-header">
                <h1 class="article-title">${articleData.title}</h1>
                <div class="article-meta">
                    <div class="meta-item">
                        <strong>&#128250;</strong> ${articleData.channelName}
                    </div>
                    <div class="meta-item">
                        <strong>&#128197;</strong> ${articleData.publishDate}
                    </div>
                    <div class="meta-item">
                        <strong>${saveIcon}</strong> ${saveDate}
                    </div>
                </div>
            </div>
            <div class="article-content resizable-article">
                ${formatArticleContent(articleData.article)}
            </div>
        </div>`;
}

/**
 * Displays a loading message
 * @param {string} message - The loading message to display
 */
function displayLoading(message = "Generating article...") {
    currentArticleData = null;
    showActionButtons(false);
    
    document.getElementById("output").innerHTML = 
        `<div class="loading-message">
            <p>&#10024; ${message}</p>
        </div>`;
}

/**
 * Displays an error message
 * @param {string} message - The error message to display
 */
function displayError(message) {
    currentArticleData = null;
    showActionButtons(false);
    
    document.getElementById("output").innerHTML = 
        `<div class="error-message">
            <p>&#10060; ${message}</p>
        </div>`;
}

/**
 * Displays an info message
 * @param {string} message - The info message to display
 */
function displayInfo(message) {
    currentArticleData = null;
    showActionButtons(false);
    
    document.getElementById("output").innerHTML = 
        `<div class="info-message">
            <p>${message}</p>
        </div>`;
}

/**
 * Initializes all event listeners for the popup
 */
function initializeEventListeners() {
    // Download article button
    document.getElementById("downloadArticle").addEventListener("click", async () => {
        if (!currentArticleData) {
            alert("No article to download");
            return;
        }
        
        const format = confirm("Click OK to Download PDF") ? "pdf" : "none";
        await downloadArticle(currentArticleData, format);
    });

    // Open in new window button
    document.getElementById("openInWindow").addEventListener("click", () => {
        if (!currentArticleData) {
            alert("No article to open");
            return;
        }
        
        openArticleInNewWindow(currentArticleData);
    });

    // View saved article button
    document.getElementById("viewSaved").addEventListener("click", async () => {
        console.log("👁️ View saved article button clicked");
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const videoId = new URLSearchParams(new URL(tab.url).search).get('v');
            
            if (!videoId) {
                displayError("Not on a YouTube video page.");
                return;
            }
            
            console.log("🔍 Looking for saved article for video ID:", videoId);
            
            const savedArticle = await getSavedArticle(videoId);
            
            if (savedArticle) {
                console.log("✅ Found saved article:", savedArticle);
                displayArticle(savedArticle, true);
            } else {
                console.log("❌ No saved article found for this video");
                displayInfo("No saved article found for this video. Generate an article first!");
            }
        } catch (error) {
            console.error("Error viewing saved article:", error);
            displayError("Error retrieving saved article: " + error.message);
        }
    });

    // Generate article button
    document.getElementById("generate").addEventListener("click", async () => {
        console.log("🚀 Generate button clicked");
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const videoId = new URLSearchParams(new URL(tab.url).search).get('v');
            
            if (!videoId) {
                displayError("Not on a YouTube video page.");
                return;
            }
            
            console.log("🔍 Video ID:", videoId);
            
            // Check if article already exists
            const existingArticle = await getSavedArticle(videoId);
            if (existingArticle) {
                console.log("📄 Found existing article, asking user if they want to regenerate");
                const shouldRegenerate = confirm(
                    `An article for this video already exists (saved ${new Date(existingArticle.savedAt).toLocaleString()}).\n\nDo you want to generate a new article?`
                );
                
                if (!shouldRegenerate) {
                    console.log("👁️ User chose to keep existing article, displaying it");
                    displayArticle(existingArticle, true);
                    return;
                }
                console.log("🔄 User chose to regenerate article");
            }

            displayLoading("Generating article...");

            // Extract video data and generate article
            const videoData = await extractVideoData();
            const articleData = await generateArticle(videoData);
            
            // Save the article
            const saved = await saveArticle(videoId, articleData);
            if (saved) {
                console.log("💾 Article saved successfully");
            } else {
                console.warn("⚠️ Failed to save article");
            }
            
            displayArticle(articleData, false);
            
        } catch (error) {
            console.error("💥 Error in generate article:", error);
            console.error("💥 Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            displayError("Error: " + error.message);
        }
    });
}
