import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const lowStockThreshold = 5;

    // Cargar productos al montar la pantalla
    useEffect(() => {
        const fetchProducts = async () => {
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
        fetchProducts();
    }, []);

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>Stock: {item.stock}</Text>
            <Text style={styles.productDetails}>Precio: ${item.price}</Text>
            {item.stock < lowStockThreshold && (
                <Text style={styles.lowStockWarning}>¡Inventario Bajo!</Text>
            )}
            <Button
                title="Detalles"
                onPress={() =>
                    Alert.alert(
                        "Detalles del Producto",
                        `Nombre: ${item.name}\nStock: ${item.stock}\nPrecio: $${item.price}`
                    )
                }
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Productos</Text>
            {loading ? (
                <Text>Cargando productos...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    productContainer: {
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
    productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    productDetails: { fontSize: 16, color: '#555' },
    lowStockWarning: { color: 'red', fontWeight: 'bold', marginTop: 5 },
});

export default ProductsScreen;
