import "./App.css";
import { Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";

import { HomePage } from "./pages/HomePage";
import CarritoPage from "./pages/CarritoPage";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPage";
import ProductosPorCategoriaPage from "./pages/ProductosPorCategoriaPage";
import OfertasPage from "./pages/OfertasPage";
import AdminProductosPage from "./pages/AdminProductosPage";
import AdminCategoriasPage from "./pages/AdminCategoriasPage";
import CheckoutPage from "./pages/CheckoutPage";
import HistorialVentasPage from "./pages/HistorialVentasPage";

// ============================================================================
// LAYOUT
// ============================================================================
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

// ============================================================================
// APP
// ============================================================================
function App() {
  return (
    <AuthProvider>
      <CartProvider>
          <ScrollToTop />

          <Routes>
            {/* HOME */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />

            {/* CARRITO */}
            <Route
              path="/carrito"
              element={
                <Layout>
                  <CarritoPage />
                </Layout>
              }
            />

            {/* PRODUCTOS */}
            <Route
              path="/productos"
              element={
                <Layout>
                  <ProductosPage />
                </Layout>
              }
            />

            {/* CATEGORÍAS */}
            <Route
              path="/categoria/:categoriaId"
              element={
                <Layout>
                  <ProductosPorCategoriaPage />
                </Layout>
              }
            />

            {/* OFERTAS */}
            <Route
              path="/ofertas"
              element={
                <Layout>
                  <OfertasPage />
                </Layout>
              }
            />

            {/* CHECKOUT */}
            <Route
              path="/checkout"
              element={
                <Layout>
                  <CheckoutPage/>
                </Layout>
              }
            />

            {/* LOGIN */}
            <Route path="/login" element={<LoginPage />} />

            {/* ADMIN */}
            <Route
              path="/admin/productos"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <AdminProductosPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categorias"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <AdminCategoriasPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/historial"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <HistorialVentasPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
