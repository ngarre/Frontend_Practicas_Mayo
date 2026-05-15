import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext.tsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminItemsPage from "./pages/admin/AdminItemsPage.tsx";



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
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                      <AdminHomePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/items"
                  element={
                    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                      <AdminItemsPage />
                    </ProtectedRoute>
                  }
                />
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