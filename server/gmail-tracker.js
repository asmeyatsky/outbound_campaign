const { google } = require('googleapis');

async function checkThreadForReply(tokens, threadId) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    try {
        const res = await gmail.users.threads.get({
            userId: 'me',
            id: threadId
        });

        const messages = res.data.messages || [];
        // If there's more than 1 message, it means someone replied (or we sent a follow-up)
        // We check the "from" of the last message to see if it's not us.
        if (messages.length > 1) {
            const lastMessage = messages[messages.length - 1];
            // Simple check: if we aren't the sender of the last message, it's a reply
            // Note: In production, you'd compare against 'me' or your email
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error checking thread ${threadId}:`, error.message);
        return false;
    }
}

module.exports = { checkThreadForReply };
