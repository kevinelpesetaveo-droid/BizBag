// ========== PRODUCTOS ==========
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// ========== MOVIMIENTOS DE INVENTARIO ==========
export interface InventoryMovement {
  start: number;
  added: number;
  waste: number;
}

// ========== LINEA DEL CUADRE (Balance Line) ==========
export interface BalanceLine {
  productId: string;
  name: string;
  price: number;
  start: number;
  added: number;
  waste: number;
  stock: number;
  sales: number;
  total: number;
}

// ========== CUADRE GUARDADO (Balance) ==========
export interface Balance {
  id: string;
  name: string;
  date: string;
  total: number;
  lines: BalanceLine[];
}

// ========== MENSAJES DEL BUZÓN ==========
export interface Message {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

// ========== USUARIO (Para Supabase) ==========
export interface User {
  id: string;
  business_name: string;
  access_key: string;
  device_id: string;
  expiration_date: string;
  is_blocked: boolean;
  role: 'user' | 'admin';
  payment_date: string;
}
