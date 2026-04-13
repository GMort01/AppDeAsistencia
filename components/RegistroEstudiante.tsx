//para agregar estudiantes nuevos

import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { registrarEstudiante } from "../models/estudiantes";

interface Props {
    onBack: () => void;
}

const RegistroEstudiante = ({ onBack }: Props) => {
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');

    const handleRegistro = () => {
        if (!id || !nombre || !celular) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        //registrar en lalista
        const exito = registrarEstudiante({ id, nombre, celular });
        if (!exito) {
            Alert.alert('Error', 'El estudiante ya existe');
            return;
        }
        Alert.alert('Registro completado');

        //volver al index
        onBack();
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Registro Estudiante</Text>
            <Text style={styles.subtitle}>Crea tu cuenta para registrar asistencia</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="ID"
                    value={id}
                    onChangeText={setId}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Celular"
                    value={celular}
                    onChangeText={setCelular}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegistro}>
                <Text style={styles.registerText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>

        </View>
    );
};

export default RegistroEstudiante;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },

  registerButton: {
    backgroundColor: '#FF9800', // naranja para diferenciar registro
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
  },

  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  backText: {
    color: '#6c757d',
    fontSize: 16,
  },
});