import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const ServicesScreen = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar servicios al montar la pantalla
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                const response = await axios.get(`${API_BASE_URL}/services.json`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data); // Verificar datos recibidos
                setServices(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los servicios");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const renderService = ({ item }) => (
        <View style={styles.serviceContainer}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.serviceDetails}>Duración: {item.duration} min</Text>
            <Text style={styles.serviceDetails}>Precio: ${item.price}</Text>
            <Button
                title="Detalles"
                onPress={() =>
                    Alert.alert(
                        "Detalles del Servicio",
                        `Nombre: ${item.name}\nDuración: ${item.duration} min\nPrecio: $${item.price}`
                    )
                }
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Servicios</Text>
            {loading ? (
                <Text>Cargando servicios...</Text>
            ) : (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={renderService}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    serviceContainer: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    serviceDetails: { fontSize: 16, color: '#555' },
});

export default ServicesScreen;
