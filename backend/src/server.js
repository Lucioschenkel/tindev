const socketIo = require('socket.io');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path');

const config = dotenv.config({ path: path.join(__dirname, '../.env') });

if (config.error) {
  throw new Error('Unable to load environment variables!');
}

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const connectedUsers = {};

io.on('connection', (socket) => {
  const { user } = socket.handshake.query;

  connectedUsers[user] = socket.id;
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});
app.use(routes);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

server.listen(process.env.PORT);
