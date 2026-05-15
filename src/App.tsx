import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext.tsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage";



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />

            <div className="app-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>

    </AuthProvider>
  );
}

export default App;