import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar citas al montar la pantalla
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                const response = await axios.get(`${API_BASE_URL}/appointments.json`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data); // Verifica la estructura de los datos
                setAppointments(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar las citas");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentContainer}>
            <Text style={styles.appointmentDetails}>
                <Text style={styles.label}>Servicio:</Text> {item.service ? item.service.name : 'Sin servicio asignado'}
            </Text>
            <Text style={styles.appointmentDetails}>
                <Text style={styles.label}>Empleado:</Text> {item.employee ? item.employee.name : 'Sin empleado asignado'}
            </Text>
            <Text style={styles.appointmentDetails}>
                <Text style={styles.label}>Fecha y Hora:</Text> {item.appointment_date}
            </Text>
            <Button
                title="Detalles"
                onPress={() =>
                    Alert.alert(
                        "Detalles de la Cita",
                        `Servicio: ${item.service ? item.service.name : 'Sin servicio'}\n` +
                        `Empleado: ${item.employee ? item.employee.name : 'Sin empleado'}\n` +
                        `Fecha y Hora: ${item.appointment_date}`
                    )
                }
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Citas</Text>
            {loading ? (
                <Text>Cargando citas...</Text>
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={renderAppointment}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    appointmentContainer: {
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
    appointmentDetails: { fontSize: 16, color: '#333', marginBottom: 5 },
    label: { fontWeight: 'bold' },
});

export default AppointmentsScreen;
