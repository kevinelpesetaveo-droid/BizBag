import * as Device from 'expo-device';
import { InventoryMovement, BalanceLine } from './index';

/**
 * Calcula el disponible (stock actual) de un producto
 * Formula: start + added - waste
 */
export const available = (m: InventoryMovement): number => {
  return (m.start || 0) + (m.added || 0) - (m.waste || 0);
};

/**
 * Formatea un número como moneda MXN
 */
export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

/**
 * Genera un ID único basado en timestamp
 */
export const generateID = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Obtiene el device ID único del teléfono
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    const deviceId = await Device.getDeviceTypeAsync();
    return `${Device.manufacturer}-${deviceId}-${Date.now()}`;
  } catch (error) {
    return `device-${Date.now()}`;
  }
};

/**
 * Calcula las ventas y totales para una l��nea de cuadre
 */
export const calculateBalanceLine = (
  productId: string,
  name: string,
  price: number,
  start: number,
  added: number,
  waste: number,
  stockFinal: number
): BalanceLine => {
  const availableStock = start + added - waste;
  const sales = availableStock - stockFinal;
  const total = sales * price;

  return {
    productId,
    name,
    price,
    start,
    added,
    waste,
    stock: stockFinal,
    sales,
    total,
  };
};

/**
 * Valida una clave de acceso
 */
export const isValidAccessKey = (key: string): boolean => {
  return key.length >= 6 && key.trim() !== '';
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calcula los días restantes hasta una fecha
 */
export const daysUntilExpiry = (expiryDate: string): number => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Genera una clave de acceso aleatoria
 */
export const generateAccessKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BIZBAG-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
