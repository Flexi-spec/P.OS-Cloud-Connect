import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { room } = req.query;
  if (!room) return res.status(400).json({ error: 'Room ID required' });

  if (req.method === 'GET') {
    const messages = await kv.get(`chat:${room}`) || [];
    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
    const { user, text } = req.body;
    const messages = await kv.get(`chat:${room}`) || [];
    const newMessage = { user, text, time: new Date().toLocaleTimeString() };
    
    messages.push(newMessage);
    await kv.set(`chat:${room}`, messages);
    return res.status(201).json(newMessage);
  }
}
