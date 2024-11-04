import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({});
    const [form, setForm] = useState({
        name: '',
        stock: '',
        price: '',
    });
    const lowStockThreshold = 5;

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
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los productos");
            console.error(error);
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
                stock: product.stock ? product.stock.toString() : '',
                price: product.price ? product.price.toString() : '',
            });
        } else {
            setIsEditing(false);
            setForm({ name: '', stock: '', price: '' });
        }
        setModalVisible(true);
    };

    const handleSaveProduct = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const productData = { ...form, stock: parseInt(form.stock), price: parseFloat(form.price) };
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/products/${currentProduct.id}.json`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Producto actualizado correctamente");
            } else {
                await axios.post(`${API_BASE_URL}/products.json`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Alert.alert("Éxito", "Producto creado correctamente");
            }
            setModalVisible(false);
            fetchProducts();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar el producto");
        }
    };

    const handleDeleteProduct = async (productId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar este producto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('authToken');
                            await axios.delete(`${API_BASE_URL}/products/${productId}.json`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            Alert.alert("Éxito", "Producto eliminado correctamente");
                            fetchProducts();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el producto");
                        }
                    }
                }
            ]
        );
    };

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <View style={styles.productInfo}>
                <FontAwesome name="archive" size={36} color="#007bff" style={styles.icon} />
                <View style={styles.productTextContainer}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDetails}>Stock: {item.stock}</Text>
                    <Text style={styles.productDetails}>Precio: ${item.price}</Text>
                    {item.stock < lowStockThreshold && (
                        <Text style={styles.lowStockWarning}>¡Inventario Bajo!</Text>
                    )}
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
                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.actionButton}>
                    <FontAwesome name="trash" size={20} color="#F44336" />
                    <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Productos</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                <Text style={styles.addButtonText}>+ Crear Producto</Text>
            </TouchableOpacity>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Stock"
                        keyboardType="numeric"
                        value={form.stock}
                        onChangeText={(text) => setForm({ ...form, stock: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Precio"
                        keyboardType="numeric"
                        value={form.price}
                        onChangeText={(text) => setForm({ ...form, price: text })}
                    />
                    <Button title="Guardar" onPress={handleSaveProduct} />
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
    productContainer: {
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
    productInfo: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 15 },
    productTextContainer: { flex: 1 },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    productDetails: { fontSize: 16, color: '#555' },
    lowStockWarning: { color: 'red', fontWeight: 'bold', marginTop: 5 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
    actionText: { fontSize: 14, marginLeft: 5 },
    addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modalContainer: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10 },
    loading: { marginTop: 20 },
});

export default ProductsScreen;
