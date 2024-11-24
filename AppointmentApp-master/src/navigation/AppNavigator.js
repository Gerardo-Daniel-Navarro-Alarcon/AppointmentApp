import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ProductsScreen from '../screens/ProductsScreen'; // Crear esta pantalla más adelante
import EmployeesScreen from '../screens/EmployeesScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import { StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Employees" component={EmployeesScreen} />
            <Stack.Screen name="Appointments" component={AppointmentsScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Services" component={ServicesScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);

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
    },
});

export default AppNavigator;
