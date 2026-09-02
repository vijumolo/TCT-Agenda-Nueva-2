import { useState, useEffect } from "react";
import { onAuthChange, login, register, logout, resetPassword } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return {
    user,
    loading,
    login: (email, pw) => login(email, pw),
    register: (email, pw) => register(email, pw),
    logout: () => logout(),
    resetPassword: (email) => resetPassword(email),
  };
}
