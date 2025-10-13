// API communication functions

/**
 * Extracts video data from the current YouTube page
 * @returns {Promise<Object>} - The extracted video data
 */
async function extractVideoData() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("📑 Active tab:", tab.url);
    
    // Extract video ID from URL
    const videoId = new URLSearchParams(new URL(tab.url).search).get('v');
    if (!videoId) {
        throw new Error("Not on a YouTube video page");
    }
    
    console.log("🔍 Video ID:", videoId);
    
    let response;
    try {
        response = await chrome.tabs.sendMessage(tab.id, { action: "extractVideoData" });
        console.log("🔄 Received response from content script:", response);
    } catch (error) {
        console.error("❌ Error sending message to content script:", error);
        throw new Error("Could not connect to YouTube page. Make sure you're on a YouTube video page and refresh the page.");
    }

    if (!response) {
        throw new Error("No video data found");
    }

    return response;
}

/**
 * Generates an article using the AI API
 * @param {Object} videoData - The video data to process
 * @returns {Promise<Object>} - The generated article data
 */
async function generateArticle(videoData) {
    const { title, description, transcript, channelName, publishDate, videoUrl } = videoData;
    
    // Log extracted data details
    console.log("📋 Extracted Data:");
    console.log("  📝 Title:", title);
    console.log("  📺 Channel:", channelName);
    console.log("  📅 Published:", publishDate);
    console.log("  🔗 Video ID:", videoData.videoId);
    console.log("  🌐 URL:", videoUrl);
    console.log("  📄 Description length:", description?.length || 0);
    console.log("  📄 Description preview:", description?.slice(0, 200) + "...");
    console.log("  📜 Transcript length:", transcript?.length || 0);
    console.log("  📜 Transcript preview:", transcript?.slice(0, 300) + "...");
    console.log("  📜 Full transcript:", transcript);

    // Prepare transcript content with fallback
    const transcriptContent = transcript && transcript.trim() 
        ? transcript.slice(0, 6000) 
        : "No transcript available for this video.";
    
    console.log("📝 Transcript content being sent:", transcriptContent);
    
    const requestBody = {
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: "You write concise, engaging, and educational articles based on the metadata and transcript." },
            { role: "user", content: `Title: ${title}\nChannel: ${channelName}\nPublished: ${publishDate}\nDescription: ${description}\nTranscript: ${transcriptContent}` }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };

    console.log("📡 Sending request to local server:");
    console.log("  🌐 URL: https://glyptographic-heelless-jimmie.ngrok-free.dev/v1/chat/completions");
    console.log("  🤖 Model:", requestBody.model);
    console.log("  📊 Request body:", JSON.stringify(requestBody, null, 2));

    // Send to your local OpenAI-compatible server
    const res = await fetch("https://glyptographic-heelless-jimmie.ngrok-free.dev/v1/chat/completions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-local-not-needed"
        },
        body: JSON.stringify(requestBody)
    });

    console.log("📨 Response status:", res.status, res.statusText);
    
    const data = await res.json();
    console.log("📥 Response data:", data);
    
    if (data.error) {
        console.error("❌ Server error:", data.error);
        throw new Error(data.error);
    }

    const article = data.choices[0].message.content;
    console.log("✅ Generated article length:", article?.length || 0);
    console.log("✅ Article preview:", article?.slice(0, 200) + "...");
    
    return {
        title: title,
        description: description,
        channelName: channelName,
        publishDate: publishDate,
        videoUrl: videoUrl,
        article: article
    };
}
