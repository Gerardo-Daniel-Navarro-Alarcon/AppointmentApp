import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/sessions.json`, {
                email,
                password,
            });

            if (response.data.token) {
                await SecureStore.setItemAsync('authToken', response.data.token);
                Alert.alert("Inicio de sesión exitoso");
                navigation.navigate("Home");
            }
        } catch (error) {
            if (error.response) {
                console.log("Respuesta del servidor:", error.response.data);
            }
            Alert.alert("Error", "Credenciales inválidas");
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://your-image-url.com/background.jpg' }}
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#fff"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#fff"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#fff',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#ff6b6b',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
