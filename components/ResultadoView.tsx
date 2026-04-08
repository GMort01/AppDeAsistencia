import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ResultadoViewProps {
  exito: boolean;
  mensaje: string;
  onVolver: () => void;
}

const ResultadoView = ({ exito, mensaje, onVolver }: ResultadoViewProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        {exito ? '✅' : '❌'}
      </Text>
      <Text style={[styles.title, { color: exito ? '#4CAF50' : '#F44336' }]}>
        {exito ? '¡Asistencia Registrada!' : 'Error de Registro'}
      </Text>
      <Text style={styles.message}>{mensaje}</Text>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: exito ? '#4CAF50' : '#2196F3' }]} 
        onPress={onVolver}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ResultadoView;