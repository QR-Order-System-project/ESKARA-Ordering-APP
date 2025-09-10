import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/User/MainPage";
import { ManagerMain } from "./pages/Manager/ManagerMain";
import CallPage from "./pages/User/CallPage";
import OrdersPage from "./pages/User/OrdersPage";
import CartPage from "./pages/User/CartPage";
import { CartProvider } from "./pages/User/data/CartContext";
import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.connect();              // 앱 시작 시 연결
    console.log("✅ Socket connected");

    return () => {
      socket.disconnect();         // 앱 종료 시 해제
      console.log("❌ Socket disconnected");
    };
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/user/main/:tableNumber" element={<MainPage />} />
          <Route path="/manager" element={<ManagerMain />} />
          <Route path="/user/call/:tableNumber" element={<CallPage />} />
          <Route path="/user/orders/:tableNumber" element={<OrdersPage />} />
          <Route path="/user/cart/:tableNumber" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
