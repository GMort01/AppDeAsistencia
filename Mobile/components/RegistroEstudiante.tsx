import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_URL } from "../constants/api";

interface Props {
    onBack: () => void;
}

const RegistroEstudiante: React.FC<Props> = ({ onBack }) => {
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');

    const handleRegistro = async () => {
        if (!id || !nombre || !celular) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre_completo: nombre,
                    correo_institucional: `${id}@universidad.edu`,
                    password: celular, 
                    rol: 'estudiante',
                    id_universitario: id
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Éxito', 'Registrado en la base de datos');
                onBack();
            } else {
                Alert.alert('Error', data.mensaje || 'Error al registrar');
            }
        } catch (error) {
            Alert.alert('Error', 'No hay conexión con el servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro Estudiante</Text>
            <Text style={styles.subtitle}>Crea tu cuenta en la base de datos</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="ID (Ej: 2024101)"
                    value={id}
                    onChangeText={setId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Completo"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Celular (Será tu contraseña)"
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
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 30 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 4 },
    input: { borderWidth: 1, borderColor: '#dee2e6', padding: 12, borderRadius: 10, marginBottom: 15, backgroundColor: '#f8f9fa' },
    registerButton: { backgroundColor: '#FF9800', padding: 18, borderRadius: 15, alignItems: 'center' },
    registerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    backButton: { marginTop: 20, alignItems: 'center' },
    backText: { color: '#6c757d', fontSize: 16 },
});