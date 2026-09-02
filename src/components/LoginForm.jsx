import { useState } from "react";

export default function LoginForm({ onLogin, onRegister, onResetPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      if (resetMode) {
        await onResetPassword(email);
        setMsg("Correo de recuperación enviado.");
      } else if (isRegister) {
        await onRegister(email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-center text-brand-700 mb-6">
          {resetMode ? "Recuperar contraseña" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
          {!resetMode && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>
          )}
          {msg && (
            <p className={`text-sm ${msg.includes("enviado") ? "text-green-600" : "text-red-600"}`}>
              {msg}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : resetMode ? "Enviar" : isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2 text-sm">
          {!resetMode && (
            <button
              onClick={() => { setIsRegister(!isRegister); setMsg(""); }}
              className="text-brand-600 hover:underline"
            >
              {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
            </button>
          )}
          <button
            onClick={() => { setResetMode(!resetMode); setIsRegister(false); setMsg(""); }}
            className="text-brand-600 hover:underline block"
          >
            {resetMode ? "Volver al login" : "¿Olvidaste tu contraseña?"}
          </button>
        </div>
      </div>
    </div>
  );
}
