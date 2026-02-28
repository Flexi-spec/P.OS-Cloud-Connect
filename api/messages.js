import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Get the room ID from the URL (?room=xyz)
  const { room } = req.query;

  if (!room) {
    return res.status(400).json({ error: 'Executive Room ID is required.' });
  }

  const roomKey = `chat_room:${room}`;

  try {
    // --- METHOD: GET (Fetching messages) ---
    if (req.method === 'GET') {
      const messages = await kv.get(roomKey) || [];
      return res.status(200).json(messages);
    }

    // --- METHOD: POST (Sending a new message) ---
    if (req.method === 'POST') {
      const { user, text } = req.body;

      if (!user || !text) {
        return res.status(400).json({ error: 'User and Text fields are mandatory.' });
      }

      // Fetch existing history from JSON storage
      const history = await kv.get(roomKey) || [];

      // Create the new message object
      const newMessage = {
        user,
        text,
        time: new Date().toLocaleTimeString('en-GB', { hour12: false })
      };

      // Add to history and keep only the last 100 messages (to save space)
      history.push(newMessage);
      const updatedHistory = history.slice(-100);

      // Save back to Vercel KV
      await kv.set(roomKey, updatedHistory);

      return res.status(201).json(newMessage);
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error("Vercel KV Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
