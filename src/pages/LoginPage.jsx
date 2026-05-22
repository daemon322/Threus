import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, CheckCircle} from "lucide-react";
import { IoIosAlert, IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaArrowRight, FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loginWithGoogle, signUp } = useAuth();
  const navigate = useNavigate();

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
    navigate("/");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalError("");
    await loginWithGoogle();
    setLoading(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md shadow-emerald-200/50 transition-transform group-hover:scale-105">
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Threus
            </span>
          </Link>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 backdrop-blur-sm">
          {/* Título dinámico */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-gray-900 text-center mb-2"
            >
              {isLogin ? "Bienvenido de nuevo" : "Crear una cuenta"}
            </motion.h2>
          </AnimatePresence>
          <p className="text-gray-500 text-center mb-6 text-sm">
            {isLogin
              ? "Ingresa tus credenciales para acceder"
              : "Completa tus datos para registrarte"}
          </p>

          {/* Mensajes */}
          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-sm text-red-700"
            >
              <IoIosAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{localError}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 text-sm text-emerald-700"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Botón Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaGoogle className="w-5 h-5 text-blue-600" />
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form
            onSubmit={isLogin ? handleEmailLogin : handleSignUp}
            className="space-y-4"
          >
            {/* Nombre (solo registro) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <IoMdEyeOff className="w-4 h-4" />
                  ) : (
                    <IoMdEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de acción */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  {isLogin ? "Iniciar sesión" : "Registrarse"}
                  <FaArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Cambio de modo */}
          <p className="text-center mt-6 text-sm text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setLocalError("");
                setSuccess("");
              }}
              className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;