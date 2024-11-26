import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    ScrollView
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const EmployeesScreen = ({ navigation }) => {
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
            setError('Por favor, completa los campos requeridos.');
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
            setError('Error al cargar empleados');
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
            setForm({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                role: '',
                phone_number: ''
            });
        }
        setModalVisible(true);
        setError(null); // Reiniciar errores al abrir el modal
    };

    // Función para guardar empleado
    const handleSaveEmployee = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setError(null);
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
        } finally {
            setLoading(false);
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

    const handleCreateEmployee = () => {
        // Implementa la lógica para crear un nuevo empleado
        // Por ejemplo, navegar a una pantalla de creación de empleado
        navigation.navigate('CreateEmployeeScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Empleados</Text>
            <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
                <FontAwesome name="plus" size={24} color="#fff" />
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
            {/* Modal de Crear/Editar */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <View style={styles.modalContent}>
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
                                placeholder="Correo Electrónico"
                                value={form.email}
                                onChangeText={(text) => setForm({ ...form, email: text })}
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                value={form.password}
                                onChangeText={(text) => setForm({ ...form, password: text })}
                                secureTextEntry
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Rol"
                                value={form.role}
                                onChangeText={(text) => setForm({ ...form, role: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Número de Teléfono"
                                value={form.phone_number}
                                onChangeText={(text) => setForm({ ...form, phone_number: text })}
                                keyboardType="phone-pad"
                            />

                            {error && <Text style={styles.errorText}>{error}</Text>}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSaveEmployee} style={styles.saveButton}>
                                    <Text style={styles.buttonText}>{isEditing ? 'Actualizar' : 'Guardar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            <EmployeeDetailsModal />
            <TouchableOpacity style={styles.button} onPress={handleCreateEmployee}>
                <Text style={styles.buttonText}>Crear Nuevo Empleado</Text>
            </TouchableOpacity>
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
    modalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
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
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
});

export default EmployeesScreen;
