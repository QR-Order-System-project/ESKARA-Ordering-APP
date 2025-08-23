require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const orderRoutes = require('./routes/orderRoutes');
const socketHandler = require('./sockets/socketHandler');
const db = require('./firebase');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

global.io = io;
global.db = db;

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);

socketHandler(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
