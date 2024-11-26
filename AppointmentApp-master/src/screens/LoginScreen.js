import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true); // Estado para controlar la visibilidad

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/sessions.json`, {
                email,
                password,
            });

            if (response.data.token) {
                await SecureStore.setItemAsync('authToken', response.data.token);
                // Navegar a la pantalla principal o donde corresponda
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Credenciales inválidas');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al iniciar sesión');
        }
    };

    const toggleSecureText = () => {
        setSecureText(!secureText);
    };

    return (
            <View style={styles.overlay}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                {/* Campo de Correo Electrónico */}
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#fff"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                {/* Campo de Contraseña con Ícono para Mostrar/Ocultar */}
                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#fff"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={toggleSecureText}>
                        <Icon
                            name={secureText ? 'eye-off-outline' : 'eye-outline'}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                {/* Botón de Iniciar Sesión */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                {/* Enlaces Adicionales */}
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        margin: 20,
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#fff',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        color: '#fff',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#fff',
        textDecorationLine: 'underline',
        marginVertical: 5,
    },
});

export default LoginScreen;
