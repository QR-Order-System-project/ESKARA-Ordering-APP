require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const employeeCallRoutes = require('./routes/employeeCallRoutes');
const fcmRoutes = require('./routes/fcmRoutes');
const socketHandler = require('./sockets/socketHandler');
const db = require('./firebase');
const { fillMenuQueue } = require('./controllers/orderController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

global.io = io;
global.db = db;

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes)
app.use('/api/payments', paymentRoutes);
app.use('/api/employee', employeeCallRoutes);
app.use("/api/fcm", fcmRoutes);

socketHandler(io);

(async () => {
  try {
    await fillMenuQueue();
    console.log("✅ menuQueue 초기화 완료");
  } catch (err) {
    console.error("❌ menuQueue 초기화 실패:", err);
  }
})();

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
