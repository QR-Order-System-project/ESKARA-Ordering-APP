import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/User/MainPage";
import { ManagerMain } from "./pages/Manager/ManagerMain";
import { ToastProvider } from "./components/ui/ToastProvider";

function App() {
  return (
    <ToastProvider position="top">
      <BrowserRouter>
        <Routes>
          <Route path="/user/main" element={<MainPage />} />
          <Route path="/manager" element={<ManagerMain />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
