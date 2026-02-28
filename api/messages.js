import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { room } = req.query;
  if (!room) return res.status(400).json({ error: 'Room ID required' });

  try {
    if (req.method === 'GET') {
      // Get messages for this specific room link
      const messages = await kv.get(`chat:${room}`) || [];
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const { user, text } = req.body;
      const messages = await kv.get(`chat:${room}`) || [];
      const newMessage = { 
        user, 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      messages.push(newMessage);
      // Keep only the last 50 messages to save space
      const limitedMessages = messages.slice(-50); 
      
      await kv.set(`chat:${room}`, limitedMessages);
      return res.status(201).json(newMessage);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
