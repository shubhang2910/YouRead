// TODO: Import OpenAI when ready to add server-side processing
// import OpenAI from "openai";

// TODO: Initialize OpenAI client when ready
// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY || "sk-local-not-needed",
//     baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1"
// });

export default async function handler(req, res) {
    try {
        const { title, description, transcript } = await req.json();

        // Safety: ensure user-triggered calls only
        if (!title) return res.status(400).json({ error: "Missing title" });

        // TODO: Add origin validation when needed
        // const allowedOrigins = ["chrome-extension://your-extension-id"];
        // const origin = req.headers.get("origin");
        // if (origin && !allowedOrigins.includes(origin)) {
        //     return res.status(403).json({ error: "Unauthorized origin" });
        // }

        // TODO: Add server-side processing here
        // - Content filtering
        // - Rate limiting
        // - Analytics/logging
        // - Caching
        // - Custom prompt engineering
        // - Multi-model support
        // - Response formatting

        // TODO: Replace with actual OpenAI call when ready
        // const completion = await client.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system", content: "You write concise, engaging educational summaries." },
        //         { role: "user", content: prompt }
        //     ],
        //     temperature: 0.7,
        // });

        // Stub response for now
        const article = `[Server-side processing stub] Article for: ${title}`;
        return res.status(200).json({ article });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to generate article" });
    }
}

// TODO: Add logging when server-side processing is implemented
// console.log("📹 Extracted data from page:", { title, description, transcript });
// console.log("📡 Sending request to API with body:", JSON.stringify({ title, description, transcript }));
// console.log("✅ Received response:", data);
