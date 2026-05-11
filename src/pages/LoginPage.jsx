import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ SOLO ESTO (coherente con AuthContext)
  const { login, loginWithGoogle, signUp } = useAuth();

  const navigate = useNavigate();

  // ==========================================
  // LOGIN EMAIL
  // ==========================================
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setLocalError("");
    setSuccess("");

    if (!email || !password) {
      setLocalError("Completa todos los campos");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    setLoading(false);

    if (!result.success) {
      setLocalError(result.error);
      return;
    }

    setSuccess("Inicio de sesión correcto");

    // 🔥 IMPORTANTE: navegación simple
    navigate("/");
  };

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError("");

    await loginWithGoogle();

    setLoading(false);
  };

  // ==========================================
  // SIGN UP
  // ==========================================
  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setLocalError("");
    setSuccess("");

    if (!email || !password || !fullName) {
      setLocalError("Completa todos los campos");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, fullName);

    setLoading(false);

    if (!result.success) {
      setLocalError(result.error);
      return;
    }

    setSuccess("Cuenta creada correctamente");

    setTimeout(() => {
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setFullName("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-green-700">MiniMarket</h1>
          </Link>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* ERROR */}
          {localError && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
              {localError}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 flex items-center justify-center gap-2 border py-2 rounded"
          >
            <FaGoogle />
            Google
          </button>

          <form
            onSubmit={isLogin ? handleEmailLogin : handleSignUp}
            className="space-y-4"
          >
            {/* NAME */}
            {!isLogin && (
              <div>
                <label>Nombre</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {loading ? "Cargando..." : isLogin ? "Login" : "Registrar"}
            </button>
          </form>

          {/* SWITCH */}
          <p className="text-center mt-4">
            {isLogin ? "No tienes cuenta?" : "Ya tienes cuenta?"}
            <button
              className="text-green-600 ml-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              cambiar
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
