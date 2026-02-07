const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generatePersonalizedHook(shopName, websiteContent) {
    if (!process.env.OPENAI_API_KEY) {
        return `noticed [${shopName}] has an impressive inventory.`;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert sales copywriter. Your goal is to write a single, short (1 sentence) personalized hook for an outreach email to a camera rental shop. Use the provided website summary to mention something specific they do well (e.g., their specific gear selection, their location, or a service they offer). Be professional and warm. Avoid generic praise."
                },
                {
                    role: "user",
                    content: `Shop Name: ${shopName}\nWebsite Snippet: ${websiteContent.substring(0, 2000)}`
                }
            ],
            max_tokens: 60
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('LLM Error:', error);
        return `noticed [${shopName}] has an impressive inventory.`;
    }
}

module.exports = { generatePersonalizedHook };
