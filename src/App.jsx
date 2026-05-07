import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import { HomePage } from "./pages/HomePage";
import CarritoPage from "./pages/CarritoPage";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/ProductosPage";
import ProductosPorCategoriaPage from "./pages/ProductosPorCategoriaPage";
import OfertasPage from "./pages/OfertasPage";

// Layout wrapper con Navbar y Footer globales
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas con Layout (Navbar + Footer) */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/carrito"
              element={
                <Layout>
                  <CarritoPage />
                </Layout>
              }
            />

            {/* Productos - todas las categorías */}
            <Route
              path="/productos"
              element={
                <Layout>
                  <ProductosPage />
                </Layout>
              }
            />

            {/* Productos por categoría específica */}
            <Route
              path="/categoria/:categoriaId"
              element={
                <Layout>
                  <ProductosPorCategoriaPage />
                </Layout>
              }
            />

            {/* Ofertas */}
            <Route
              path="/ofertas"
              element={
                <Layout>
                  <OfertasPage />
                </Layout>
              }
            />

            {/* Login sin Layout (pantalla completa) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas adicionales que crees irán aquí */}
            {/* <Route path="/admin" element={<Layout><AdminPage /></Layout>} /> */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
