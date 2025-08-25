import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/User/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
