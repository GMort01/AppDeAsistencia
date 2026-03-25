import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

interface EstudianteViewProps {
  onBack: () => void;
}

const EstudianteView = ({ onBack }: EstudianteViewProps) => {
  const [estudianteId, setEstudianteId] = useState('');
  const [celular, setCelular] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleRegistrar = () => {
    if (!estudianteId || !celular || !qrCode) {
      Alert.alert("Atención", "Por favor completa todos los campos.");
      return;
    }
    Alert.alert("Validando...", "Verificando identidad y QR.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Volver al Inicio</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Registro de Asistencia</Text>
      <Text style={styles.instruction}>Ingresa tus datos y pega el código QR.</Text>

      <TextInput 
        style={styles.input} 
        placeholder="ID del Estudiante" 
        value={estudianteId}
        onChangeText={setEstudianteId}
        keyboardType="numeric"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Celular registrado" 
        value={celular}
        onChangeText={setCelular}
        keyboardType="phone-pad"
      />

      <TextInput 
        style={[styles.input, styles.qrInput]} 
        placeholder="Pega aquí el texto del QR" 
        value={qrCode}
        onChangeText={setQrCode}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleRegistrar}>
        <Text style={styles.buttonText}>Registrar Asistencia</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#fff', justifyContent: 'center' },
  backButton: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { color: '#2196F3', fontSize: 16, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2196F3', marginBottom: 10 },
  instruction: { fontSize: 14, color: '#666', marginBottom: 25 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  qrInput: { height: 80, textAlignVertical: 'top', backgroundColor: '#f9f9f9' },
  button: { backgroundColor: '#2196F3', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EstudianteView;