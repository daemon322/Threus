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

  const { loginWithGoogle, loginWithEmail, signUp } = useAuth();
  const navigate = useNavigate();

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError("");
    await loginWithGoogle();
    setLoading(false);
  };

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    setSuccess("");

    if (!email || !password) {
      setLocalError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    const result = await loginWithEmail(email, password);
    if (result.success) {
      setSuccess("¡Sesión iniciada correctamente!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setLocalError(result.error || "Error al iniciar sesión");
    }
    setLoading(false);
  };

  // Handle SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");
    setSuccess("");

    if (!email || !password || !fullName) {
      setLocalError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, fullName);
    if (result.success) {
      setSuccess(
        "¡Cuenta creada! Verifica tu correo para confirmar tu registro",
      );
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setFullName("");
        setIsLogin(true);
      }, 2000);
    } else {
      setLocalError(result.error || "Error al registrarse");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Encabezado */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-green-700">
              MiniMarket Express
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Inicia sesión en tu cuenta" : "Crea una nueva cuenta"}
          </p>
        </div>

        {/* Tarjeta de formulario */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          whileHover={{ boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)" }}
        >
          {/* Error y Success Messages */}
          {localError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {localError}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <FaGoogle className="text-red-500" />
            Continuar con Google
          </button>

          {/* Divisor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form
            onSubmit={isLogin ? handleEmailLogin : handleSignUp}
            className="space-y-4"
          >
            {/* Full Name (Solo en signup) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre Completo
                </label>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:border-green-600">
                  <FaUser className="text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="flex-1 outline-none bg-transparent"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:border-green-600">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contraseña
              </label>
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:border-green-600">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all disabled:opacity-50 mt-6"
            >
              {loading
                ? "Cargando..."
                : isLogin
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
            </button>
          </form>

          {/* Toggle Login/SignUp */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setLocalError("");
                  setSuccess("");
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                className="text-green-600 hover:text-green-700 font-medium ml-1"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Volver a inicio */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
