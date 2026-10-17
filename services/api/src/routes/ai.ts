import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { optionalAuth } from '../auth.js';

export const aiRouter = Router();

const OFFLINE =
  'The shopping assistant is not running on this demo. This box is here so you can see the chat. Answers run on the production service.';

// The demo keeps the chat panel and does not call the copilot. Any message gets the same reply.
aiRouter.post('/ai/chat', optionalAuth, (req, res) => {
  const raw = req.body?.conversationId;
  const conversationId = typeof raw === 'string' && raw.length > 0 ? raw : randomUUID();
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  const send = (event: unknown) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  send({ type: 'meta', conversationId });
  send({ type: 'token', text: OFFLINE });
  send({ type: 'done', mode: 'copilot' });
  res.end();
});
