import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const EmployeesScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState({});
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: '',
        phone_number: '',
    });

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
                <TouchableOpacity onPress={() => Alert.alert("Detalles", JSON.stringify(item, null, 2))} style={styles.actionButton}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    employeeContainer: {
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
    employeeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
    },
    employeeTextContainer: {
        flex: 1,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    employeeDetails: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    actionText: {
        fontSize: 14,
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
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
});

export default EmployeesScreen;
