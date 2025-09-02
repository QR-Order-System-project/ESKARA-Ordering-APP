import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/User/MainPage";
import { ManagerMain } from "./pages/Manager/ManagerMain";
import CallPage from "./pages/User/CallPage";
import OrdersPage from "./pages/User/OrdersPage";
import CartPage from "./pages/User/CartPage";
import { CartProvider } from "./pages/User/data/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/user/main" element={<MainPage />} />
          <Route path="/manager" element={<ManagerMain />} />
          <Route path="/user/call" element={<CallPage />} />
          <Route path="/user/orders" element={<OrdersPage />} />
          <Route path="/user/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
