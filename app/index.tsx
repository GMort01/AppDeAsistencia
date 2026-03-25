import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProfesorView from '../components/ProfesorView';
import EstudianteView from '../components/EstudianteView';

export default function Index() {
  // Estado para controlar qué vista mostrar (null, 'maestro', 'estudiante')
  const [role, setRole] = useState<string | null>(null);

  // 1. Si el rol es 'maestro', le pasamos la función para que pueda volver
  if (role === 'maestro') {
    return <ProfesorView onBack={() => setRole(null)} />;
  }

  // 2. Si el rol es 'estudiante', hacemos lo mismo
  if (role === 'estudiante') {
    return <EstudianteView onBack={() => setRole(null)} />;
  }

  // 3. Pantalla inicial (Role Selection)
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Smart Attendance QR</Text>
      <Text style={styles.instruction}>Selecciona tu rol para comenzar:</Text>

      <TouchableOpacity 
        style={[styles.roleButton, { backgroundColor: '#4CAF50' }]} 
        onPress={() => setRole('maestro')}
      >
        <Text style={styles.roleText}>Soy Profesor (Admin)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.roleButton, { backgroundColor: '#2196F3' }]} 
        onPress={() => setRole('estudiante')}
      >
        <Text style={styles.roleText}>Soy Estudiante</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>MVP - Arquitectura Limpia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  instruction: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
  },
  roleButton: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    // Sombras para que se vea más "pro"
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#bdc3c7',
    fontSize: 12,
  }
});