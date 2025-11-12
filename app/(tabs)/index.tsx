import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

// Definimos un "tipo" para nuestros proyectos (TypeScript)
interface Project {
  _id: string;
  title: string;
  description: string;
}

// URL de tu API. ¡Asegúrate de que tu backend esté corriendo!
// NOTA: Si pruebas en un Android físico, ¡NO PUEDES USAR LOCALHOST!
// Debes usar la dirección IP de tu PC en la red local.
// 1. En tu PC (Windows), abre CMD y escribe: ipconfig
// 2. Busca tu "Dirección IPv4". Será algo como 192.168.1.75
const API_URL = 'http://192.168.1.75:3001/api/proyectos';
// Si pruebas en un emulador de Android o en la web, 'http://localhost:3001' podría funcionar.

export default function HomeScreen() {
  // Estados para guardar los datos, el estado de carga y los errores
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar los datos cuando la app inicia
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('No se pudo conectar al servidor');
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- Renderizado Condicional ---

  // 1. Si está cargando, muestra un indicador nativo
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando proyectos...</Text>
      </View>
    );
  }

  // 2. Si hubo un error, muestra el mensaje de error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text>Asegúrate de que el servidor backend esté corriendo.</Text>
        <Text>URL: {API_URL}</Text>
      </View>
    );
  }

  // 3. Si todo salió bien, muestra la lista de proyectos
  //    Usamos <FlatList>, el componente nativo optimizado para listas.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Proyectos</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item._id} // La "key" prop, igual que en React web
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  // Estilos para la tarjeta de proyecto
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});