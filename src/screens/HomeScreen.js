import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [authToken, setAuthToken] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync('authToken');
            setAuthToken(token);
        };
        loadToken();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('authToken');
        Alert.alert("Cierre de sesión exitoso");
        navigation.navigate("Login");
    };

    const handleNavigate = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Bienvenido a AppointmentByRails</Text>

            {authToken ? (
                <>
                    <Text style={styles.subtitle}>Selecciona una opción para gestionar:</Text>

                    <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Employees")}>
                        <Text style={styles.cardText}>Empleados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Services")}>
                        <Text style={styles.cardText}>Servicios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Products")}>
                        <Text style={styles.cardText}>Productos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Appointments")}>
                        <Text style={styles.cardText}>Citas</Text>
                    </TouchableOpacity>

                    <Button title="Cerrar Sesión" onPress={handleLogout} color="#d9534f" />
                </>
            ) : (
                <Text style={styles.info}>Cargando...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
    card: {
        width: '80%',
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    cardText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    info: { fontSize: 16, textAlign: 'center', marginVertical: 10 },
});

export default HomeScreen;
