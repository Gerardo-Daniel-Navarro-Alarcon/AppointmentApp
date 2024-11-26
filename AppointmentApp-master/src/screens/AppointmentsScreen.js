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
    ScrollView,
    Alert,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
            console.error('Error al cargar servicios:', error);
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

    const handleCloseModal = () => {
        setModalVisible(false);
        setError(null);
    };

    const handleSaveAppointment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const token = await SecureStore.getItemAsync('authToken');
            const url = isEditing ? `${API_BASE_URL}/appointments/${selectedAppointment.id}.json` : `${API_BASE_URL}/appointments.json`;
            const method = isEditing ? 'put' : 'post';
            const response = await axios({
                method: method,
                url: url,
                data: form,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (isEditing) {
                setAppointments(appointments.map(app => app.id === selectedAppointment.id ? response.data : app));
            } else {
                setAppointments([...appointments, response.data]);
            }
            handleCloseModal();
        } catch (err) {
            setError('Error al guardar la cita.');
        } finally {
            setLoading(false);
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
                            setAppointments(appointments.filter(a => a.id !== appointmentId));
                            Alert.alert("Éxito", "Cita eliminada correctamente");
                        } catch (err) {
                            Alert.alert("Error", "No se pudo eliminar la cita");
                        }
                    }
                }
            ]
        );
    };

    const handleShowDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setDetailsModalVisible(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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
            visible={detailsModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDetailsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Detalles de la Cita</Text>
                    {selectedAppointment && (
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="person" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Empleado ID</Text>
                                    <Text style={styles.detailValue}>{selectedAppointment.employee_id}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="build" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Servicio ID</Text>
                                    <Text style={styles.detailValue}>{selectedAppointment.service_id}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="access-time" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Fecha y Hora</Text>
                                    <Text style={styles.detailValue}>{formatDate(selectedAppointment.appointment_date)}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="info" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Estado</Text>
                                    <Text style={styles.detailValue}>{selectedAppointment.status}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="note" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Notas</Text>
                                    <Text style={styles.detailValue}>{selectedAppointment.notes || 'Sin notas'}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="date-range" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Creado</Text>
                                    <Text style={styles.detailValue}>{formatDate(selectedAppointment.created_at)}</Text>
                                </View>
                                <MaterialIcons name="update" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Actualizado</Text>
                                    <Text style={styles.detailValue}>{formatDate(selectedAppointment.updated_at)}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setDetailsModalVisible(false)}
                    >
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Renderizar el modal de añadir/editar
    const renderModal = () => (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Editar Cita' : 'Nueva Cita'}</Text>

                    <ScrollView>
                        <TextInput
                            style={styles.input}
                            placeholder="Empleado ID"
                            value={form.employee_id}
                            onChangeText={(text) => setForm({ ...form, employee_id: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Servicio ID"
                            value={form.service_id}
                            onChangeText={(text) => setForm({ ...form, service_id: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Fecha y Hora (YYYY-MM-DD HH:MM)"
                            value={form.appointment_date}
                            onChangeText={(text) => setForm({ ...form, appointment_date: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Estado"
                            value={form.status}
                            onChangeText={(text) => setForm({ ...form, status: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Notas"
                            value={form.notes}
                            onChangeText={(text) => setForm({ ...form, notes: text })}
                            multiline
                        />

                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleCloseModal} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveAppointment} style={styles.saveButton}>
                                <Text style={styles.buttonText}>{isEditing ? 'Actualizar' : 'Guardar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            {/* Lista de citas */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={appointments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAppointment}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* Botón para añadir cita */}
            <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Modales */}
            {renderModal()}
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
        width: 60,
        height: 60,
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
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 10,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
});

export default AppointmentsScreen;
