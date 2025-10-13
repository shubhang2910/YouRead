// Background script - currently not needed since popup.js handles summarization directly
// This file can be used for other background tasks if needed in the future

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // Handle other background tasks here if needed
    console.log("Background script received message:", msg);
    return true;
});