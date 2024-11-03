import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';  // Importa SecureStore
import { API_BASE_URL } from '@env';

import axios from 'axios';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/sessions.json`, {  // Usa API_BASE_URL aquí
                email,
                password,
            });

            if (response.data.token) {
                // Guardar el token en almacenamiento seguro
                await SecureStore.setItemAsync('authToken', response.data.token); // Almacena el token
                Alert.alert("Inicio de sesión exitoso");
                // Navegar a la pantalla de inicio o principal
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
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10 },
});

export default LoginScreen;
