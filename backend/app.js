const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON body 파싱

// 라우터 불러오기
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const menuQueueRoutes = require("./routes/menuQueueRoutes");
const employeeCallRoutes = require("./routes/employeeCallRoutes");

// 라우터 등록
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/menu-queue", menuQueueRoutes);
app.use("/api/employee-calls", employeeCallRoutes);

// 기본 루트
app.get("/", (req, res) => {
  res.send("QR 주문 시스템 백엔드 서버 작동 중");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
