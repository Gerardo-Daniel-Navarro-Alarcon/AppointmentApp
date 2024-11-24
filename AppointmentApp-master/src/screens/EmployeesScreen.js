import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const EmployeesScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState({});
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: '',
        phone_number: '',
        created_at: '',
        updated_at: '',
    });

    // Función para validar formulario
    const validateForm = () => {
        if (!form.first_name || !form.last_name || !form.email) {
            setError('Por favor complete los campos requeridos');
            return false;
        }
        return true;
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.get(`${API_BASE_URL}/employees.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(response.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los empleados");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setIsEditing(true);
            setCurrentEmployee(employee);
            setForm({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                password: '',
                role: employee.role || '',
                phone_number: employee.phone_number || '',
            });
        } else {
            setIsEditing(false);
            setForm({ first_name: '', last_name: '', email: '', password: '', role: '', phone_number: '' });
        }
        setModalVisible(true);
    };

    // Función para guardar empleado
    const handleSaveEmployee = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const employeeData = { ...form };
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/employees/${currentEmployee.id}.json`, employeeData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Empleado actualizado correctamente");
            } else {
                await axios.post(`${API_BASE_URL}/employees.json`, employeeData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Empleado creado correctamente");
            }
            setModalVisible(false);
            fetchEmployees();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el empleado");
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar este empleado?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('authToken');
                            await axios.delete(`${API_BASE_URL}/employees/${employeeId}.json`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            Alert.alert("Éxito", "Empleado eliminado correctamente");
                            fetchEmployees();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el empleado");
                        }
                    }
                }
            ]
        );
    };

    // Función para mostrar el modal de detalles
    const handleShowDetails = (employee) => {
        setSelectedEmployee(employee);
        setDetailsModalVisible(true);
    };

    // Función auxiliar para formatear fechas
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
    
    const renderEmployee = ({ item }) => (
        <View style={styles.employeeContainer}>
            <View style={styles.employeeInfo}>
                <FontAwesome name="user" size={36} color="#007bff" style={styles.icon} />
                <View style={styles.employeeTextContainer}>
                    <Text style={styles.employeeName}>{`${item.first_name || ''} ${item.last_name || ''}`}</Text>
                    <Text style={styles.employeeDetails}>Email: {item.email || 'No disponible'}</Text>
                    <Text style={styles.employeeDetails}>Teléfono: {item.phone_number || 'No disponible'}</Text>
                    <Text style={styles.employeeDetails}>Rol: {item.role || 'No especificado'}</Text>
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
                <TouchableOpacity onPress={() => handleDeleteEmployee(item.id)} style={styles.actionButton}>
                    <FontAwesome name="trash" size={20} color="#F44336" />
                    <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Componente Modal de Detalles
    const EmployeeDetailsModal = () => (
        <Modal
            visible={detailsModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDetailsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Detalles del Empleado</Text>
                    
                    {selectedEmployee && (
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="person" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Nombre Completo</Text>
                                    <Text style={styles.detailValue}>
                                        {`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                                    </Text>
                                    
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="email" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Correo</Text>
                                    <Text style={styles.detailValue}>{selectedEmployee.email}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="phone" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Teléfono</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedEmployee.phone_number || 'No disponible'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="work" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Rol</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedEmployee.role || 'No especificado'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="access-time" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Creado</Text>
                                    <Text style={styles.detailValue}>
                                        {formatDate(selectedEmployee.created_at)}
                                    </Text>
                                </View>
                                <MaterialIcons name="update" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Actualizado</Text>
                                    <Text style={styles.detailValue}>
                                        {formatDate(selectedEmployee.updated_at)}
                                    </Text>
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Empleados</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                <Text style={styles.addButtonText}>+ Crear Empleado</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : (
                <FlatList
                    data={employees}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderEmployee}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={form.first_name}
                        onChangeText={(text) => setForm({ ...form, first_name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Apellido"
                        value={form.last_name}
                        onChangeText={(text) => setForm({ ...form, last_name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                    />
                    {!isEditing && (
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            secureTextEntry
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                        />
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Rol"
                        value={form.role}
                        onChangeText={(text) => setForm({ ...form, role: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        value={form.phone_number}
                        onChangeText={(text) => setForm({ ...form, phone_number: text })}
                    />
                    <Button title="Guardar" onPress={handleSaveEmployee} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
                </ScrollView>
            </Modal>
            <EmployeeDetailsModal />
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
    employeeContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        padding: 15,
        marginBottom: 10,
    },
    employeeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#ff6b6b',
        marginRight: 10,
    },
    employeeTextContainer: {
        flex: 1,
    },
    employeeName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    employeeDetails: {
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
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        borderRadius: 30,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
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
    }
});

export default EmployeesScreen;
