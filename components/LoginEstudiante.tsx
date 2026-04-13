//inicio de sesion de estudiantes con id celular ->basico

import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { listaEstudiantes, validarIdentidadEstudiante } from "../models/estudiantes";

//estados para tomar lo que ingresa el estudiante
const LoginEstudiante=({onLogin, onBack}:any)=>{
    const [id,setId]=useState('');
    const [celular, setCelular]= useState('');

    //funcion para que se ejecute cuando se da clic en ingresar
    const handleLogin=()=>{
        if (!id || !celular){
            Alert.alert('Error','Complete todos los campos');
            return;
        }

        //para validar con bd en memoria
        const esValido=validarIdentidadEstudiante(id,celular);

        if (!esValido){
            Alert.alert('Acceso denegado','Id o celular incorrectos');
            return;
        }

        const estudiante=listaEstudiantes.find(e=>e.id===id);

        //guardar sesion en el index
        onLogin(estudiante);
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Login Estudiantes</Text>

            <View style={styles.card}>
                <TextInput
                style={styles.input}
                placeholder="ID"
                value={id}
                onChangeText={setId}
                />
                <TextInput
                style={styles.input}
                placeholder="Celular"
                value={celular}
                onChangeText={setCelular}
                keyboardType="numeric"
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