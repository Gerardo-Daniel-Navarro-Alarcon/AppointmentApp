import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native'; // Agrega esta línea
import LoginScreen from '../screens/LoginScreen';
import ProductsScreen from '../screens/ProductsScreen'; // Crear esta pantalla más adelante
import EmployeesScreen from '../screens/EmployeesScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons'; // Importa FontAwesome

const Stack = createStackNavigator();

const AppNavigator = () => {

    // Función de cierre de sesión
    const handleLogout = async (navigation) => {
        try {
            await SecureStore.deleteItemAsync('authToken');  // Elimina el token de autenticación
            Alert.alert("Cierre de sesión exitoso");
            navigation.navigate("Login");  // Navega de vuelta a la pantalla de login
        } catch (error) {
            Alert.alert("Error", "No se pudo cerrar la sesión");
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={({ navigation }) => ({
                    headerStyle: {
                        backgroundColor: '#2c3e50',
                        height: 100,
                        elevation: 5,
                        shadowOpacity: 0.3,
                    },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                    headerBackTitleVisible: false,
                    cardStyle: { backgroundColor: '#f5f6fa' },
                    headerTitleAlign: 'center',
                    animation: 'slide_from_right',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => handleLogout(navigation)} style={styles.logoutButton}>
                            <FontAwesome name="sign-out" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                })}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Employees" component={EmployeesScreen} />
                <Stack.Screen name="Appointments" component={AppointmentsScreen} />
                <Stack.Screen name="Products" component={ProductsScreen} />
                <Stack.Screen name="Services" component={ServicesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// Estilos actualizados para un tema claro
const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)', // Fondo claro
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000', // Texto oscuro
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)', // Fondo claro para inputs
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#000', // Texto oscuro
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#2196F3', // Color del botón
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }, logoutButton: {
        marginRight: 15,
        padding: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AppNavigator;
