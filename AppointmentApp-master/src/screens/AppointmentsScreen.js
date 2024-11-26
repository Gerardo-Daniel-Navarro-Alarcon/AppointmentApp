import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [form, setForm] = useState({
        employee_id: '',
        service_id: '',
        appointment_date: '',
        status: '',
        notes: '',
        created_at: '',
        updated_at: '',
    });

    // Validar formulario
    const validateForm = () => {
        if (!form.employee_id || !form.service_id || !form.appointment_date) {
            setError('Por favor, completa los campos requeridos.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        fetchAppointments();
        fetchServices();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.get(`${API_BASE_URL}/appointments.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (err) {
            setError('Error al cargar citas');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.get(`${API_BASE_URL}/services.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setIsEditing(true);
            setForm({
                employee_id: appointment.employee_id.toString(),
                service_id: appointment.service_id.toString(),
                appointment_date: appointment.appointment_date.substring(0, 16), // Formato 'YYYY-MM-DDTHH:MM'
                status: appointment.status,
                notes: appointment.notes || '',
                created_at: appointment.created_at,
                updated_at: appointment.updated_at,
            });
            setSelectedAppointment(appointment);
        } else {
            setIsEditing(false);
            setForm({
                employee_id: '',
                service_id: '',
                appointment_date: '',
                status: '',
                notes: '',
                created_at: '',
                updated_at: '',
            });
        }
        setModalVisible(true);
        setError(null);
    };

    const handleSaveAppointment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.post(`${API_BASE_URL}/appointments.json`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments([...appointments, response.data]);
            setModalVisible(false);
            setForm({
                employee_id: '',
                service_id: '',
                appointment_date: '',
                status: '',
                notes: '',
                created_at: '',
                updated_at: '',
            });
        } catch (err) {
            setError('Error al crear la cita.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(appointments.filter(a => a.id !== appointmentId));
        } catch (err) {
            setError('Error al eliminar cita');
        }
    };

    const handleShowDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setDetailsModalVisible(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const renderAppointment = ({ item }) => (
        <View style={styles.appointmentContainer}>
            <View style={styles.appointmentInfo}>
                <FontAwesome name="calendar" size={36} color="#007bff" style={styles.icon} />
                <View style={styles.appointmentTextContainer}>
                    <Text style={styles.appointmentName}>Empleado ID: {item.employee_id}</Text>
                    <Text style={styles.appointmentDetails}>Servicio ID: {item.service_id}</Text>
                    <Text style={styles.appointmentDetails}>Fecha y Hora: {formatDate(item.appointment_date)}</Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleShowDetails(item)} style={styles.actionButton}>
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

    // Modal de Detalles
    const AppointmentDetailsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={detailsModalVisible}
            onRequestClose={() => setDetailsModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Detalles de la Cita</Text>
                    {selectedAppointment && (
                        <>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Fecha: </Text>
                                {new Date(selectedAppointment.date).toLocaleDateString()}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Hora: </Text>
                                {new Date(selectedAppointment.date).toLocaleTimeString()}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Servicio: </Text>
                                {services.find(s => s.id === selectedAppointment.service_id)?.name || 'N/A'}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Duración: </Text>
                                {services.find(s => s.id === selectedAppointment.service_id)?.duration || 'N/A'} minutos
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Precio: </Text>
                                ${services.find(s => s.id === selectedAppointment.service_id)?.price || 'N/A'}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.boldText}>Estado: </Text>
                                {selectedAppointment.status}
                            </Text>
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setDetailsModalVisible(false)}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Citas</Text>
            <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Añadir Cita</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAppointment}
                />
            )}

            {/* Modal de Crear/Editar */}
            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {isEditing ? 'Editar Cita' : 'Nueva Cita'}
                    </Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre del Cliente"
                        value={form.client_name}
                        onChangeText={(text) => setForm({ ...form, client_name: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Servicio"
                        value={form.service}
                        onChangeText={(text) => setForm({ ...form, service: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Fecha (YYYY-MM-DD)"
                        value={form.date}
                        onChangeText={(text) => setForm({ ...form, date: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Hora (HH:MM)"
                        value={form.time}
                        onChangeText={(text) => setForm({ ...form, time: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Estado"
                        value={form.status}
                        onChangeText={(text) => setForm({ ...form, status: text })}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveAppointment}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>

            {/* Modal de Detalles */}
            {detailsModalVisible && <AppointmentDetailsModal />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    listContainer: {
        paddingBottom: 20,
    },
    appointmentContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        padding: 15,
        marginBottom: 10,
    },
    appointmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#ff6b6b',
        marginRight: 10,
    },
    appointmentTextContainer: {
        flex: 1,
    },
    appointmentName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    appointmentDetails: {
        color: '#fff',
        opacity: 0.8,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: '#ff6b6b',
        padding: 15,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        borderRadius: 30,
        flexGrow: 1,
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    loading: {
        marginTop: 20,
    },
    detailsContainer: {
        marginVertical: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
    },
    detailInfo: {
        marginLeft: 15,
        flex: 1,
    },
    detailLabel: {
        color: '#fff',
        opacity: 0.7,
        fontSize: 14,
    },
    detailValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    closeButton: {
        backgroundColor: '#ff6b6b',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#ff6b6b',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#ff6b6b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 30,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'left',
        fontSize: 16
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    }
});

export default AppointmentsScreen;