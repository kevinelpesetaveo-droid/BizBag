// Datos de muestra para pruebas en desarrollo
import { Product } from '../../types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pan Blanco',
    price: 20,
    category: 'Harina',
  },
  {
    id: 'p2',
    name: 'Pan Integral',
    price: 25,
    category: 'Harina',
  },
  {
    id: 'p3',
    name: 'Coca Cola 2L',
    price: 35,
    category: 'Bebidas',
  },
  {
    id: 'p4',
    name: 'Agua Purificada',
    price: 15,
    category: 'Bebidas',
  },
  {
    id: 'p5',
    name: 'Leche Entera',
    price: 28,
    category: 'Lácteos',
  },
  {
    id: 'p6',
    name: 'Queso Fresco',
    price: 80,
    category: 'Lácteos',
  },
  {
    id: 'p7',
    name: 'Papas Fritas',
    price: 15,
    category: 'Snacks',
  },
  {
    id: 'p8',
    name: 'Chocolatina',
    price: 5,
    category: 'Dulces',
  },
];

export const CATEGORIES = ['Harina', 'Bebidas', 'Dulces', 'Snacks', 'Lácteos'];
