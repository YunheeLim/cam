import { WebSocketServer } from 'ws';

let wss;

export default function handler(req, res) {
  if (!wss) {
    // Initialize WebSocket server
    wss = new WebSocketServer({ noServer: true });

    // Handle WebSocket connections
    wss.on('connection', ws => {
      ws.on('message', message => {
        wss.clients.forEach(client => {
          if (client.readyState === ws.OPEN && client !== ws) {
            client.send(message);
          }
        });
      });
    });

    // Upgrade HTTP to WebSocket protocol
    req.socket.server.on('upgrade', (request, socket, head) => {
      if (request.url === '/api/signal') {
        wss.handleUpgrade(request, socket, head, ws => {
          wss.emit('connection', ws, request);
        });
      }
    });
  }
  res.status(200).json({ message: 'WebSocket signaling server ready' });
}
