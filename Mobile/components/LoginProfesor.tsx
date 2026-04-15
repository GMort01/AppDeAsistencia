import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_URL } from "../constants/api";

// Cambiamos el nombre a LoginProfesor
const LoginProfesor = ({ onLogin, onBack }: any) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!id || !password) {
            Alert.alert('Error', 'Complete todos los campos');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login-profesor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Para profesores usualmente es el correo completo o el ID
                    correo_institucional: id.includes('@') ? id : `${id}@universidad.edu`,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Login Profesor exitoso");
                setTimeout(() => {
                    onLogin(data.usuario);
                }, 150); 
            } else {
                Alert.alert('Acceso denegado', data.mensaje || 'Credenciales de profesor incorrectas');
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            Alert.alert('Error', 'No hay conexión con el servidor de profesores.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Título corregido */}
            <Text style={styles.title}>Login Profesores</Text>
            <Text style={styles.subtitle}>Panel de Administración</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Usuario o ID de Profesor"
                    value={id}
                    onChangeText={setId}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry 
                />
            </View>

            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                activeOpacity={0.7}
            >
                <Text style={styles.loginText}>Acceder al Panel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={{ color: '#6c757d' }}>← Volver a Selección</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginProfesor;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' }, // Color verde
    subtitle: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 30 },
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
        backgroundColor: '#f8f9fa' 
    },
    loginButton: { 
        backgroundColor: '#4CAF50', // Verde para diferenciar del azul de estudiantes
        padding: 18, 
        borderRadius: 15, 
        alignItems: 'center',
        elevation: 3 
    },
    loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    backButton: { marginTop: 25, alignItems: 'center' }
});