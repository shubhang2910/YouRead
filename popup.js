// Main entry point for YouRead Chrome Extension Popup
// This file coordinates all the modules and initializes the popup

/**
 * Initializes the popup when the DOM is ready
 */
function initializePopup() {
    console.log("🚀 Initializing YouRead popup...");
    
    try {
        // Initialize all event listeners
        initializeEventListeners();
        
        console.log("✅ Popup initialized successfully");
    } catch (error) {
        console.error("❌ Error initializing popup:", error);
        
        // Display error in the UI
        const output = document.getElementById("output");
        if (output) {
            output.innerHTML = `
                <div class="error-message">
                    <p>&#10060; Error initializing extension: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Initialize the popup when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePopup);
} else {
    // DOM is already ready
    initializePopup();
}