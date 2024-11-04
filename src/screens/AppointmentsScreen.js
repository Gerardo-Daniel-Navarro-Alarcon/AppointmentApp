import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState({});
    const [form, setForm] = useState({
        service: '',
        employee: '',
        appointment_date: '',
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.get(`${API_BASE_URL}/appointments.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar las citas");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setIsEditing(true);
            setCurrentAppointment(appointment);
            setForm({
                service: appointment.service ? appointment.service.name : '',
                employee: appointment.employee ? appointment.employee.name : '',
                appointment_date: appointment.appointment_date,
            });
        } else {
            setIsEditing(false);
            setForm({ service: '', employee: '', appointment_date: '' });
        }
        setModalVisible(true);
    };

    const handleSaveAppointment = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const appointmentData = { ...form };
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/appointments/${currentAppointment.id}.json`, appointmentData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Cita actualizada correctamente");
            } else {
                await axios.post(`${API_BASE_URL}/appointments.json`, appointmentData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Cita creada correctamente");
            }
            setModalVisible(false);
            fetchAppointments();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la cita");
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar esta cita?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('authToken');
                            await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}.json`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            Alert.alert("Éxito", "Cita eliminada correctamente");
                            fetchAppointments();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la cita");
                        }
                    }
                }
            ]
        );
    };

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentContainer}>
            <View style={styles.appointmentInfo}>
                <FontAwesome name="calendar" size={36} color="#007bff" style={styles.icon} />
                <View style={styles.appointmentTextContainer}>
                    <Text style={styles.appointmentDetails}>
                        <Text style={styles.label}>Servicio:</Text> {item.service ? item.service.name : 'Sin servicio'}
                    </Text>
                    <Text style={styles.appointmentDetails}>
                        <Text style={styles.label}>Empleado:</Text> {item.employee ? item.employee.name : 'Sin empleado'}
                    </Text>
                    <Text style={styles.appointmentDetails}>
                        <Text style={styles.label}>Fecha y Hora:</Text> {item.appointment_date}
                    </Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => Alert.alert("Detalles", JSON.stringify(item, null, 2))} style={styles.actionButton}>
                    <FontAwesome name="info-circle" size={20} color="#007bff" />
                    <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenModal(item)} style={styles.actionButton}>
                    <FontAwesome name="edit" size={20} color="#4CAF50" />
                    <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAppointment(item.id)} style={styles.actionButton}>
                    <FontAwesome name="trash" size={20} color="#F44336" />
                    <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Citas</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                <Text style={styles.addButtonText}>+ Crear Cita</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={renderAppointment}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Editar Cita' : 'Nueva Cita'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Servicio"
                        value={form.service}
                        onChangeText={(text) => setForm({ ...form, service: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Empleado"
                        value={form.employee}
                        onChangeText={(text) => setForm({ ...form, employee: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Fecha y Hora"
                        value={form.appointment_date}
                        onChangeText={(text) => setForm({ ...form, appointment_date: text })}
                    />
                    <Button title="Guardar" onPress={handleSaveAppointment} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
    listContainer: { paddingBottom: 20 },
    appointmentContainer: {
        padding: 15,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    appointmentInfo: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 15 },
    appointmentTextContainer: { flex: 1 },
    appointmentDetails: { fontSize: 16, color: '#555', marginTop: 4 },
    label: { fontWeight: 'bold' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
    actionText: { fontSize: 14, marginLeft: 5 },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 },
    loading: { marginTop: 20 },
});

export default AppointmentsScreen;
