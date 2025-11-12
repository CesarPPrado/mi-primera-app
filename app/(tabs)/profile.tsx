// app/(tabs)/profile.tsx
import React from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';
import Login from '../../components/Login';
import { useAuth } from '../../context/AuthContext';

// --- Importaciones Corregidas ---
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

export default function ProfileScreen() {
  // 1. Consumimos el estado de autenticación
  const { isLoggedIn, isLoading, logout } = useAuth();

  // 2. Si la app está cargando (verificando el token), mostramos un spinner
  if (isLoading) {
    return (
      // Usamos ThemedView para que el fondo coincida con el tema
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  // 3. Si el usuario SÍ está logueado, mostramos su perfil
  if (isLoggedIn) {
    return (
      // Usamos ThemedView y ThemedText
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.title}>¡Bienvenido!</ThemedText>
        <ThemedText>Has iniciado sesión correctamente.</ThemedText>
        <Button title="Cerrar Sesión (Logout)" onPress={logout} color="red" />
      </ThemedView>
    );
  }

  // 4. Si NO está logueado, mostramos el formulario de Login
  return <Login />;
}

// --- Estilos ---
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});