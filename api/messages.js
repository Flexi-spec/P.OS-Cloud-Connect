import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { room } = req.query;
  if (!room) return res.status(400).json({ error: 'Room ID required' });
  const key = `room:${room}`;

  if (req.method === 'GET') {
    const data = await kv.get(key) || [];
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { user, text } = req.body;
    const history = await kv.get(key) || [];
    const msg = {
      user,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    history.push(msg);
    await kv.set(key, history.slice(-50)); // Keep last 50 messages
    return res.status(201).json(msg);
  }
}
