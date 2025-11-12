// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Definimos la "forma" de nuestro contexto (para TypeScript)
interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; // Estado para saber si estamos cargando el token
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Creamos el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Componente "Proveedor" que envolverá nuestra aplicación.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Empezamos cargando

  // 3. Este useEffect se ejecuta 1 VEZ cuando la app arranca
  //    para verificar si ya hay un token guardado en el teléfono.
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Error al cargar el token", e);
      } finally {
        setIsLoading(false); // Terminamos de cargar
      }
    };
    loadToken();
  }, []);

  // 4. Función de Login: guarda el token en el estado Y en el storage
  const login = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem('token', newToken);
  };

  // 5. Función de Logout: borra el token del estado Y del storage
  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  // 6. El "valor" que proveemos a toda la app
  const value = {
    token,
    isLoggedIn: !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para consumir el contexto fácilmente
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
