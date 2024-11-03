import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const EmployeesScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar empleados al montar la pantalla
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken'); // Obtener token
                const response = await axios.get(`${API_BASE_URL}/employees.json`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los empleados");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const renderEmployee = ({ item }) => (
        <View style={styles.employeeContainer}>
            <Text style={styles.employeeName}>{item.full_name}</Text>
            <Text style={styles.employeeDetails}>Email: {item.email}</Text>
            <Button title="Detalles" onPress={() => Alert.alert("Detalles del Empleado", `Nombre: ${item.full_name}\nEmail: ${item.email}`)} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Empleados</Text>
            {loading ? (
                <Text>Cargando empleados...</Text>
            ) : (
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderEmployee}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    employeeContainer: {
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
    employeeName: { fontSize: 18, fontWeight: 'bold' },
    employeeDetails: { fontSize: 14, color: '#555' },
});

export default EmployeesScreen;
