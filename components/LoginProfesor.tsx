//inicio de sesion pa profesores con id correo y contrasena

import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { validarProfesor } from "../models/profesor";

//estados de los input
const LoginProfesor = ({ onLogin, onBack }: any) => {
    const [id, setId] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!correo || !password) {
            Alert.alert('Error', 'Complete todos los campos');
            return;
        }
        const profesor = validarProfesor(correo, password);
        if (!profesor) {
            Alert.alert('Error', 'Credenciales incorrectas');
            return;
        }
        onLogin(profesor);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Profesor</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    value={correo}
                    onChangeText={setCorreo}
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
            onPress={handleLogin}>
                <Text>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}>
                <Text>Volver</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginProfesor;

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
    loginButton: {
        backgroundColor: '#4caf50',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 4,
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    }
});