import { create } from 'zustand';
import { Product, InventoryMovement, Balance, BalanceLine, Message } from '../types';
import * as db from './database/init';
import * as supabaseClient from './supabase/client';
import { generateID, daysUntilExpiry } from './utils/helpers';

interface BizBagState {
  // Sesión
  loggedIn: boolean;
  userName: string;
  accountStatus: 'active' | 'blocked' | 'expired';
  expiry: string;
  darkMode: boolean;
  deviceId: string;
  userId: string;

  // Datos Locales
  products: Product[];
  inventory: Record<string, InventoryMovement>;
  balances: Balance[];
  messages: Message[];

  // Acciones (Funciones)
  setLoggedIn: (value: boolean) => void;
  setUser: (name: string, expiry: string, status: 'active' | 'blocked' | 'expired', userId: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;

  // Productos
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProducts: () => Promise<void>;

  // Inventario
  updateInventory: (id: string, movement: InventoryMovement) => Promise<void>;
  loadInventory: () => Promise<void>;

  // Cuadres
  saveBalance: (name: string, lines: BalanceLine[], total: number) => Promise<void>;
  loadBalances: () => Promise<void>;

  // Mensajes
  loadMessages: () => Promise<void>;
  markMessageAsRead: (messageId: string) => void;

  // Inicialización
  initialize: () => Promise<void>;
  cleanOldData: () => Promise<void>;
}

export const useBizBagStore = create<BizBagState>((set, get) => ({
  // Estado inicial
  loggedIn: false,
  userName: '',
  accountStatus: 'active',
  expiry: '',
  darkMode: false,
  deviceId: '',
  userId: '',
  products: [],
  inventory: {},
  balances: [],
  messages: [],

  // Sesión
  setLoggedIn: (value) => set({ loggedIn: value }),
  setUser: (name, expiry, status, userId) => {
    set({ userName: name, expiry, accountStatus: status, userId, loggedIn: true });
  },
  logout: () => {
    set({
      loggedIn: false,
      userName: '',
      userId: '',
      accountStatus: 'active',
      expiry: '',
      products: [],
      inventory: {},
      balances: [],
      messages: [],
    });
  },
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Productos
  addProduct: async (product) => {
    try {
      const newProduct: Product = {
        id: generateID(),
        ...product,
      };
      await db.addProduct(newProduct);
      set((state) => ({ products: [...state.products, newProduct] }));
      console.log('✅ Producto agregado');
    } catch (error) {
      console.error('❌ Error agregando producto:', error);
    }
  },
  updateProduct: async (product) => {
    try {
      await db.updateProduct(product);
      set((state) => ({
        products: state.products.map((p) => (p.id === product.id ? product : p)),
      }));
      console.log('✅ Producto actualizado');
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
    }
  },
  deleteProduct: async (id) => {
    try {
      await db.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      console.log('✅ Producto eliminado');
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
    }
  },
  loadProducts: async () => {
    try {
      const products = await db.getAllProducts();
      set({ products });
      console.log(`✅ ${products.length} productos cargados`);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
    }
  },

  // Inventario
  updateInventory: async (id, movement) => {
    try {
      await db.updateInventory(id, movement.start, movement.added, movement.waste);
      set((state) => ({
        inventory: { ...state.inventory, [id]: movement },
      }));
      console.log('✅ Inventario actualizado');
    } catch (error) {
      console.error('❌ Error actualizando inventario:', error);
    }
  },
  loadInventory: async () => {
    try {
      const inventory = await db.getAllInventory();
      set({ inventory });
      console.log('✅ Inventario cargado');
    } catch (error) {
      console.error('❌ Error cargando inventario:', error);
    }
  },

  // Cuadres
  saveBalance: async (name, lines, total) => {
    try {
      const balance: Balance = {
        id: generateID(),
        name,
        date: new Date().toISOString(),
        total,
        lines,
      };
      await db.saveBalance(balance);
      set((state) => ({ balances: [...state.balances, balance] }));
      console.log('✅ Cuadre guardado');
    } catch (error) {
      console.error('❌ Error guardando cuadre:', error);
    }
  },
  loadBalances: async () => {
    try {
      const balances = await db.getAllBalances();
      set({ balances });
      console.log(`✅ ${balances.length} cuadres cargados`);
    } catch (error) {
      console.error('❌ Error cargando cuadres:', error);
    }
  },

  // Mensajes
  loadMessages: async () => {
    try {
      const { userId } = get();
      if (!userId) return;
      const messages = await supabaseClient.getMessages(userId);
      set({ messages: messages as Message[] });
      console.log(`✅ ${messages.length} mensajes cargados`);
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  },
  markMessageAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === messageId ? { ...m, read: true } : m)),
    }));
  },

  // Inicialización
  initialize: async () => {
    try {
      console.log('🚀 Inicializando BizBag...');
      await db.initializeDatabase();
      await get().loadProducts();
      await get().loadInventory();
      await get().loadBalances();
      await get().cleanOldData();
      console.log('✅ Aplicación inicializada');
    } catch (error) {
      console.error('❌ Error inicializando:', error);
    }
  },
  cleanOldData: async () => {
    try {
      await db.cleanOldBalances();
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  },
}));
