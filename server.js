const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the index.html file
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/public/static')));

const clients = new Set();

const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');

  ws.on('message', (message) => {
    const decodedMessage = message.toString('utf-8');
    console.log(`Received message: ${decodedMessage}`);
    broadcast(decodedMessage);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.render('index.html');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
