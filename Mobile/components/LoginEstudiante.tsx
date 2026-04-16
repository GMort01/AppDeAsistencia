import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { postJson } from "../constants/api";
import { obtenerDeviceIdsCompat } from "../utils/deviceId";

const LoginEstudiante = ({ onLogin, onBack }: any) => {
    const [id, setId] = useState('');
    const [celular, setCelular] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleLogin = async () => {
        if (!id || !celular) {
            Alert.alert('Error', 'Complete todos los campos');
            return;
        }

        setCargando(true);
        try {
            const ids = await obtenerDeviceIdsCompat();
            const { ok, data } = await postJson('/auth/login/estudiante', {
                correo_institucional: `${id}@universidad.edu`,
                password: celular,
                deviceId: ids.principal,
                deviceIdSecundario: ids.secundario ?? '',
            });

            if (ok && data.usuario) {
                console.log("Login exitoso, datos del usuario:", data.usuario);
                onLogin(data.usuario);
            } else {
                Alert.alert(
                    'Acceso denegado',
                    String(data.mensaje || 'Credenciales incorrectas')
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo conectar con el servidor. Revisa tu IP.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Estudiantes</Text>
            <Text style={{textAlign: 'center', marginBottom: 20, color: '#7f8c8d'}}>Ingresa con tu ID y Celular</Text>

            <View style={styles.card}>
                <TextInput
                    style={styles.input}
                    placeholder="ID Universitario"
                    value={id}
                    onChangeText={setId}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tu celular (Contraseña)"
                    value={celular}
                    onChangeText={setCelular}
                    keyboardType="numeric"
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                style={[styles.loginButton, cargando && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>Ingresar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={{color: '#6c757d'}}>← Volver</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginEstudiante;

const styles =StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        padding:20,
        backgroundColor:'#fff',
    },
    title:{
        fontSize:28,
        fontWeight:'bold',
        color:'#2c3e50',
        textAlign:'center',
    },
    card:{
        backgroundColor:'#fff',
        padding:20,
        borderRadius:15,
        marginBottom:20,
        elevation:4,
        shadowColor:'#000',
        shadowOpacity:0.1,
        shadowRadius:4,
    },
    input:{
        borderWidth:1,
        borderColor:'#dee2e6',
        padding:12,
        borderRadius:10,
        marginBottom:15,
        backgroundColor:'#f8f9fa',
    },
    loginButton:{
        backgroundColor:'#2196f3',
        padding:18,
        borderRadius:15,
        alignItems:'center',
        elevation:4,
    },
    backButton:{
        marginTop:20,
        alignItems:'center',
    }
});
