import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

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
            <View style={styles.header}>
                <Text style={styles.title}>Bienvenido a AppointmentByRails</Text>
            </View>

            {authToken ? (
                <>
                    <Text style={styles.subtitle}>Selecciona una opción para gestionar:</Text>

                    <View style={styles.cardContainer}>
                        <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Employees")}>
                            <FontAwesome5 name="user-tie" size={24} color="#fff" />
                            <Text style={styles.cardText}>Empleados</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Services")}>
                            <MaterialIcons name="miscellaneous-services" size={24} color="#fff" />
                            <Text style={styles.cardText}>Servicios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Products")}>
                            <FontAwesome5 name="box" size={24} color="#fff" />
                            <Text style={styles.cardText}>Productos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.card} onPress={() => handleNavigate("Appointments")}>
                            <MaterialIcons name="calendar-today" size={24} color="#fff" />
                            <Text style={styles.cardText}>Citas</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={20} color="#fff" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.info}>Cargando...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    card: {
        width: '40%',
        paddingVertical: 20,
        backgroundColor: '#4a90e2',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#d9534f',
        borderRadius: 8,
        width: '80%',
        marginTop: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default HomeScreen;