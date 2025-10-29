import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange } from '../services/authService';
import { getAuth } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthChange devuelve la función 'unsubscribe'
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Se llama al desmontar el componente para limpiar
    return unsubscribe;
  }, []);

  const value = {
    currentUser
  };

  // No renderiza la app hasta que sepamos si hay un usuario o no
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};