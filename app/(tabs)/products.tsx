import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { SheetModal } from '../../components/ui/SheetModal';
import { Card } from '../../components/ui/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../../types';
import { generateID } from '../../lib/utils/helpers';

const CATEGORIES = ['Harina', 'Bebidas', 'Dulces', 'Snacks', 'Lácteos'];

export default function ProductsScreen() {
  const { products, addProduct, updateProduct, deleteProduct } = useBizBagStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: CATEGORIES[0] });
  const [errors, setErrors] = useState({ name: '', price: '' });

  useEffect(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const validateForm = () => {
    const newErrors = { name: '', price: '' };
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.price || isNaN(parseFloat(formData.price))) newErrors.price = 'El precio debe ser un número';
    setErrors(newErrors);
    return !newErrors.name && !newErrors.price;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;
    if (editingProduct) {
      await updateProduct({ ...editingProduct, name: formData.name, price: parseFloat(formData.price), category: formData.category });
    } else {
      await addProduct({ name: formData.name, price: parseFloat(formData.price), category: formData.category });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: CATEGORIES[0] });
    setEditingProduct(null);
    setShowModal(false);
    setErrors({ name: '', price: '' });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price.toString(), category: product.category });
    setShowModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Productos" />

      <View className="flex-1">
        <ScrollView className="px-4 py-4">
          {/* Buscador */}
          <TextInput
            placeholder="Buscar producto..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            label="Buscar"
          />

          {/* Filtros por Categoría */}
          <Text className="text-foreground text-sm font-semibold mt-4 mb-2">Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-chip mr-2 ${
                selectedCategory === null ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <Text className={selectedCategory === null ? 'text-white font-semibold' : 'text-foreground'}>
                Todas
              </Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-chip mr-2 ${
                  selectedCategory === cat ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text className={selectedCategory === cat ? 'text-white font-semibold' : 'text-foreground'}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Lista de Productos */}
          {filteredProducts.length === 0 ? (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="inbox" size={48} color="#E2E8F0" />
              <Text className="text-muted text-center mt-4">No hay productos</Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                title={product.name}
                subtitle={product.category}
                value={`$${product.price}`}
                onPress={() => openEditModal(product)}
              />
            ))
          )}
        </ScrollView>

        {/* Botón Flotante */}
        <TouchableOpacity
          onPress={() => { setEditingProduct(null); setFormData({ name: '', price: '', category: CATEGORIES[0] }); setShowModal(true); }}
          className="absolute bottom-20 right-4 w-16 h-16 rounded-full bg-primary items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <SheetModal
        visible={showModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        onClose={resetForm}
        onConfirm={handleAddProduct}
        confirmText={editingProduct ? 'Actualizar' : 'Crear'}
      >
        <TextInput
          label="Nombre"
          placeholder="Ej: Pan Blanco"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          error={errors.name}
        />
        <TextInput
          label="Precio"
          placeholder="Ej: 20"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          keyboardType="numeric"
          error={errors.price}
          style={{ marginTop: 12 }}
        />
        <View style={{ marginTop: 12 }}>
          <Text className="text-foreground font-semibold mb-2 text-sm">Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setFormData({ ...formData, category: cat })}
                className={`px-4 py-2 rounded-chip mr-2 ${
                  formData.category === cat ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text className={formData.category === cat ? 'text-white font-semibold' : 'text-foreground'}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SheetModal>
    </SafeAreaView>
  );
}
