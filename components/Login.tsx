// components/Login.tsx
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';

// --- IMPORTACIONES CORREGIDAS ---
import { API_URL } from '../constants/Api'; // Importación nombrada
import Colors from '../constants/Colors'; // Importación por defecto
// ---------------------------------

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  // Obtiene el tema actual ('light' o 'dark')
  const colorScheme = useColorScheme() ?? 'light'; 

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        await login(result.token);
      } else {
        throw new Error(result.message || 'Error al iniciar sesión');
      }

    } catch (error: any) {
      Alert.alert('Error de Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Iniciar Sesión</ThemedText>
      <TextInput
        // Estilos dinámicos para el tema
        style={[
          styles.input,
          { 
            color: '#FFFFFF', // ¡CAMBIO! Forzamos el texto a ser blanco
            borderColor: Colors[colorScheme].tint 
          }
        ]}
        placeholder="Email"
        placeholderTextColor={Colors[colorScheme].text} 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        // Estilos dinámicos para el tema
        style={[
          styles.input,
          { 
            color: '#FFFFFF', // ¡CAMBIO! Forzamos el texto a ser blanco
            borderColor: Colors[colorScheme].tint 
          }
        ]}
        placeholder="Contraseña"
        placeholderTextColor={Colors[colorScheme].text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />
      <Button 
        title={isLoading ? 'Iniciando...' : 'Iniciar Sesión'} 
        onPress={handleLogin} 
        disabled={isLoading} 
      />
    </ThemedView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});