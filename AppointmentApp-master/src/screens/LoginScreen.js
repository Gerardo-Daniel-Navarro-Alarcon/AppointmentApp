import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true); // Estado para controlar la visibilidad
    const [isForgotPasswordVisible, setForgotPasswordVisible] = useState(false);
    const [isRegisterVisible, setRegisterVisible] = useState(false);

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
        <ScrollView contentContainerStyle={styles.container}>
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
                    <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
                        <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRegisterVisible(true)}>
                        <Text style={styles.linkText}>¿No tienes una cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal de Forgot Password */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isForgotPasswordVisible}
                onRequestClose={() => setForgotPasswordVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={() => {
                                // Lógica para recuperar contraseña
                                Alert.alert("Enviado", "Revisa tu correo electrónico para más instrucciones.");
                                setForgotPasswordVisible(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setForgotPasswordVisible(false)}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Register */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isRegisterVisible}
                onRequestClose={() => setRegisterVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Crear Cuenta</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            autoCapitalize="words"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={() => {
                                // Lógica para registrar usuario
                                Alert.alert("Cuenta creada", "Tu cuenta ha sido creada exitosamente.");
                                setRegisterVisible(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setRegisterVisible(false)}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
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
        backgroundColor: '#ff6b6b',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
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
        color: '#1E90FF',
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    closeText: {
        color: '#1E90FF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
