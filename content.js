console.log("🎬 YouRead content script loaded on YouTube");
console.log("🌐 Current URL:", window.location.href);

// Check if we're on a YouTube video page
if (!window.location.href.includes('youtube.com/watch')) {
    console.warn("⚠️ Not on a YouTube video page, content script may not work properly");
}

// Function to extract video metadata with multiple selector fallbacks
function extractVideoMetadata() {
    console.log("🔍 Extracting YouTube video metadata...");
    
    // Title extraction with multiple fallbacks
    const titleSelectors = [
        'h1.ytd-video-primary-info-renderer',
        'h1.title',
        'h1[class*="title"]',
        'h1',
        'title'
    ];
    
    let title = '';
    for (const selector of titleSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim()) {
            title = element.innerText.trim();
            console.log(`📝 Title found with selector: ${selector}`);
            break;
        }
    }
    
    // Description extraction with multiple fallbacks
    const descriptionSelectors = [
        '#description',
        'ytd-video-description-renderer #description',
        '[id*="description"]',
        '.ytd-video-description-renderer'
    ];
    
    let description = '';
    for (const selector of descriptionSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim()) {
            description = element.innerText.trim();
            console.log(`📄 Description found with selector: ${selector}`);
            break;
        }
    }
    
    // Channel name extraction
    const channelSelectors = [
        'ytd-channel-name a',
        '#channel-name a',
        '.ytd-channel-name a',
        '[class*="channel-name"] a'
    ];
    
    let channelName = '';
    for (const selector of channelSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim()) {
            channelName = element.innerText.trim();
            console.log(`📺 Channel found with selector: ${selector}`);
            break;
        }
    }
    
    // View count extraction
    const viewSelectors = [
        'ytd-video-view-count-renderer',
        '#count',
        '[class*="view-count"]'
    ];
    
    let viewCount = '';
    for (const selector of viewSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim()) {
            viewCount = element.innerText.trim();
            console.log(`👀 View count found with selector: ${selector}`);
            break;
        }
    }
    
    // Transcript extraction (YouTube's transcript feature)
    const transcriptSelectors = [
        'ytd-transcript-segment-renderer',
        '.ytd-transcript-segment-renderer',
        '[class*="transcript-segment"]',
        'ytd-transcript-body-renderer',
        '.ytd-transcript-body-renderer'
    ];
    
    let transcript = '';
    let transcriptFound = false;
    
    for (const selector of transcriptSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 Checking transcript selector "${selector}": found ${elements.length} elements`);
        
        if (elements.length > 0) {
            transcript = Array.from(elements).map(el => el.innerText).join(' ').trim();
            console.log(`📜 Transcript found with selector "${selector}": ${elements.length} segments, ${transcript.length} characters`);
            console.log(`📜 Transcript preview:`, transcript.slice(0, 200));
            transcriptFound = true;
            break;
        }
    }
    
    if (!transcriptFound) {
        console.log("⚠️ No transcript found with any selector. This might be because:");
        console.log("   - Transcript is not available for this video");
        console.log("   - Transcript panel is not open");
        console.log("   - YouTube has changed their DOM structure");
        console.log("   - Video is too new and transcript hasn't been generated yet");
    }
    
    // Video URL
    const videoUrl = window.location.href;
    const videoId = new URLSearchParams(window.location.search).get('v');
    
    // Publish date extraction
    const dateSelectors = [
        'ytd-video-primary-info-renderer #date',
        '#date',
        '[class*="date"]'
    ];
    
    let publishDate = '';
    for (const selector of dateSelectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim()) {
            publishDate = element.innerText.trim();
            console.log(`📅 Publish date found with selector: ${selector}`);
            break;
        }
    }
    
    const metadata = {
        title: title || document.title,
        description: description || '',
        channelName: channelName || '',
        viewCount: viewCount || '',
        publishDate: publishDate || '',
        transcript: transcript || '',
        videoUrl: videoUrl,
        videoId: videoId || '',
        extractedAt: new Date().toISOString()
    };
    
    console.log("📋 Extracted metadata:", metadata);
    return metadata;
}

// Function to wait for elements to load
function waitForElements(selectors, timeout = 5000) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        function checkElements() {
            for (const selector of selectors) {
                if (document.querySelector(selector)) {
                    resolve(true);
                    return;
                }
            }
            
            if (Date.now() - startTime > timeout) {
                console.log("⏰ Timeout waiting for elements");
                resolve(false);
                return;
            }
            
            setTimeout(checkElements, 100);
        }
        
        checkElements();
    });
}

// Function to open the transcript panel
async function openTranscriptPanel() {
    console.log("📜 Attempting to open transcript panel...");
    
    // First, try to find and click the "Show transcript" button
    const transcriptButtonSelectors = [
        'button[aria-label*="Show transcript"]',
        'button[aria-label*="Transcript"]',
        'ytd-menu-renderer button[aria-label*="transcript" i]',
        'button[aria-label*="transcript" i]',
        'ytd-video-description-renderer button[aria-label*="transcript" i]'
    ];
    
    for (const selector of transcriptButtonSelectors) {
        const button = document.querySelector(selector);
        if (button) {
            console.log(`📜 Found transcript button with selector: ${selector}`);
            button.click();
            console.log("📜 Clicked transcript button");
            
            // Wait a bit for the transcript to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }
    }
    
    // If no direct button found, try to find the "..." menu and click it
    console.log("📜 No direct transcript button found, trying menu approach...");
    
    const menuButtonSelectors = [
        'button[aria-label*="More actions"]',
        'button[aria-label*="More"]',
        'ytd-menu-renderer button',
        '#menu button',
        'button[aria-haspopup="menu"]'
    ];
    
    for (const selector of menuButtonSelectors) {
        const menuButton = document.querySelector(selector);
        if (menuButton) {
            console.log(`📜 Found menu button with selector: ${selector}`);
            menuButton.click();
            console.log("📜 Clicked menu button");
            
            // Wait for menu to open
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Now look for transcript option in the menu using text search
            const menuItems = document.querySelectorAll('ytd-menu-service-item-renderer[role="menuitem"]');
            console.log(`📜 Found ${menuItems.length} menu items, searching for transcript option...`);
            
            for (const menuItem of menuItems) {
                const text = menuItem.innerText.toLowerCase();
                console.log(`📜 Menu item text: "${text}"`);
                
                if (text.includes('transcript') || text.includes('show transcript')) {
                    console.log(`📜 Found transcript menu option: "${menuItem.innerText}"`);
                    menuItem.click();
                    console.log("📜 Clicked transcript menu option");
                    
                    // Wait for transcript to load
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return true;
                }
            }
            
            // If we opened a menu but didn't find transcript, close it
            document.body.click();
            break;
        }
    }
    
    console.log("⚠️ Could not find or open transcript panel");
    return false;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "extractVideoData") {
        console.log("📨 Received extractVideoData message");
        
        // Wait for page to load, then extract metadata
        const titleSelectors = [
            'h1.ytd-video-primary-info-renderer',
            'h1.title',
            'h1'
        ];
        
        waitForElements(titleSelectors, 3000).then(async () => {
            // First, try to open the transcript panel
            console.log("📜 Attempting to open transcript panel for better extraction...");
            const transcriptOpened = await openTranscriptPanel();
            
            if (transcriptOpened) {
                console.log("✅ Transcript panel opened successfully");
                // Wait a bit more for transcript to fully load
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                console.log("⚠️ Could not open transcript panel, proceeding with current state");
            }
            
            const metadata = extractVideoMetadata();
            
            // Validate that we have at least a title
            if (!metadata.title || metadata.title === 'YouTube') {
                console.warn("⚠️ No valid title found, using fallback");
                metadata.title = document.title || 'Unknown Video';
            }
            
            console.log("✅ Sending metadata to popup:", metadata);
            sendResponse(metadata);
        }).catch((error) => {
            console.error("❌ Error extracting metadata:", error);
            sendResponse({
                title: document.title || 'Unknown Video',
                description: '',
                channelName: '',
                viewCount: '',
                publishDate: '',
                transcript: '',
                videoUrl: window.location.href,
                videoId: new URLSearchParams(window.location.search).get('v') || '',
                extractedAt: new Date().toISOString(),
                error: error.message
            });
        });
        
        return true; // Keep message channel open for async response
    }
});
