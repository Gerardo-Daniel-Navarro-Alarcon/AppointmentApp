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

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({});
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        low_stock_threshold: '',
        active: true
    });

    // Validar formulario
    const validateForm = () => {
        if (!form.name || !form.price || !form.stock || !form.category_id) {
            setError('Por favor complete los campos requeridos: nombre, precio, stock y categoría');
            return false;
        }
        if (isNaN(form.price) || parseFloat(form.price) <= 0) {
            setError('El precio debe ser un número válido mayor a 0');
            return false;
        }
        if (isNaN(form.stock) || parseInt(form.stock) < 0) {
            setError('El stock debe ser un número válido igual o mayor a 0');
            return false;
        }
        return true;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await axios.get(`${API_BASE_URL}/products.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error al cargar los productos');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                stock: product.stock?.toString() || '',
                category_id: product.category_id?.toString() || '',
                low_stock_threshold: product.low_stock_threshold?.toString() || '',
                active: product.active
            });
        } else {
            setIsEditing(false);
            setForm({
                name: '',
                description: '',
                price: '',
                stock: '',
                category_id: '',
                low_stock_threshold: '',
                active: true
            });
        }
        setModalVisible(true);
        setError(null);
    };

    const handleSaveProduct = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${API_BASE_URL}/products/${selectedProduct.id}.json`
                : `${API_BASE_URL}/products.json`;

            const response = await axios({
                method,
                url,
                headers: { Authorization: `Bearer ${token}` },
                data: form
            });

            if (isEditing) {
                setProducts(products.map(p => p.id === selectedProduct.id ? response.data : p));
            } else {
                setProducts([...products, response.data]);
            }

            setModalVisible(false);
            setForm({
                name: '',
                description: '',
                price: '',
                stock: '',
                created_at: '',
                updated_at: '',
            });
        } catch (err) {
            setError('Error al guardar producto');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            await axios.delete(`${API_BASE_URL}/products/${productId}.json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            setError('Error al eliminar producto');
        }
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setDetailsModalVisible(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <View style={styles.productInfo}>
                <FontAwesome name="box" size={36} color="#007bff" style={styles.icon} />
                <View style={styles.productTextContainer}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDetails}>Precio: ${item.price}</Text>
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
                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.actionButton}>
                    <FontAwesome name="trash" size={20} color="#F44336" />
                    <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Modal de Detalles
    const ProductDetailsModal = () => (
        <Modal
            visible={detailsModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDetailsModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Detalles del Producto</Text>

                    {selectedProduct && (
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="inventory" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Nombre</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.name}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="description" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Descripción</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.description || 'N/A'}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="attach-money" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Precio</Text>
                                    <Text style={styles.detailValue}>${selectedProduct.price}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="storage" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Stock</Text>
                                    <Text style={styles.detailValue}>{selectedProduct.stock}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <MaterialIcons name="access-time" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Creado</Text>
                                    <Text style={styles.detailValue}>{formatDate(selectedProduct.created_at)}</Text>
                                </View>
                                <MaterialIcons name="update" size={24} color="#fff" />
                                <View style={styles.detailInfo}>
                                    <Text style={styles.detailLabel}>Actualizado</Text>
                                    <Text style={styles.detailValue}>{formatDate(selectedProduct.updated_at)}</Text>
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
            <Text style={styles.title}>Lista de Productos</Text>
            <TouchableOpacity onPress={() => handleOpenModal()} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Añadir Producto</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                />
            )}

            {/* Modal de Crear/Editar */}
            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                    </Text>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={form.description}
                        onChangeText={(text) => setForm({ ...form, description: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Precio"
                        value={form.price}
                        keyboardType="numeric"
                        onChangeText={(text) => setForm({ ...form, price: text })}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Stock"
                        value={form.stock}
                        keyboardType="numeric"
                        onChangeText={(text) => setForm({ ...form, stock: text })}
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
                            onPress={handleSaveProduct}
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
            {detailsModalVisible && <ProductDetailsModal />}
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
    productContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        padding: 15,
        marginBottom: 10,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#ff6b6b',
        marginRight: 10,
    },
    productTextContainer: {
        flex: 1,
    },
    productName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    productDetails: {
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
});

export default ProductsScreen;