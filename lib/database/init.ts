import * as SQLite from 'expo-sqlite';
import { Product, Balance, BalanceLine } from '../../types';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Inicializa la base de datos SQLite
 */
export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    db = await SQLite.openDatabaseAsync('bizbag.db');

    // Crear tablas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        category TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inventory (
        product_id TEXT PRIMARY KEY,
        start INTEGER DEFAULT 0,
        added INTEGER DEFAULT 0,
        waste INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE IF NOT EXISTS balances (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        total INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS balance_lines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        balance_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        start INTEGER NOT NULL,
        added INTEGER NOT NULL,
        waste INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        sales INTEGER NOT NULL,
        total INTEGER NOT NULL,
        FOREIGN KEY (balance_id) REFERENCES balances(id)
      );
    `);

    console.log('✅ Base de datos inicializada');
    return db;
  } catch (error) {
    console.error('❌ Error inicializando BD:', error);
    throw error;
  }
};

/**
 * Obtiene la instancia de la base de datos
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// ========== PRODUCTOS ==========

export const addProduct = async (product: Product): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(
    `INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)`,
    [product.id, product.name, product.price, product.category]
  );
};

export const getAllProducts = async (): Promise<Product[]> => {
  const db = getDatabase();
  const result = await db.getAllAsync(
    `SELECT id, name, price, category FROM products ORDER BY name ASC`
  );
  return result as Product[];
};

export const updateProduct = async (product: Product): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(
    `UPDATE products SET name = ?, price = ?, category = ? WHERE id = ?`,
    [product.name, product.price, product.category, product.id]
  );
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(`DELETE FROM products WHERE id = ?`, [productId]);
  await db.runAsync(`DELETE FROM inventory WHERE product_id = ?`, [productId]);
};

// ========== INVENTARIO ==========

export const updateInventory = async (
  productId: string,
  start: number,
  added: number,
  waste: number
): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO inventory (product_id, start, added, waste) VALUES (?, ?, ?, ?)`,
    [productId, start, added, waste]
  );
};

export const getInventory = async (
  productId: string
): Promise<{ start: number; added: number; waste: number } | null> => {
  const db = getDatabase();
  const result = await db.getFirstAsync(
    `SELECT start, added, waste FROM inventory WHERE product_id = ?`,
    [productId]
  );
  return result as any;
};

export const getAllInventory = async (): Promise<Record<string, any>> => {
  const db = getDatabase();
  const result = await db.getAllAsync(`SELECT product_id, start, added, waste FROM inventory`);
  const inventory: Record<string, any> = {};
  result.forEach((item: any) => {
    inventory[item.product_id] = {
      start: item.start,
      added: item.added,
      waste: item.waste,
    };
  });
  return inventory;
};

// ========== CUADRES ==========

export const saveBalance = async (balance: Balance): Promise<void> => {
  const db = getDatabase();

  // Insertar balance principal
  await db.runAsync(
    `INSERT INTO balances (id, name, date, total) VALUES (?, ?, ?, ?)`,
    [balance.id, balance.name, balance.date, balance.total]
  );

  // Insertar líneas del cuadre
  for (const line of balance.lines) {
    await db.runAsync(
      `INSERT INTO balance_lines (balance_id, product_id, name, price, start, added, waste, stock, sales, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        balance.id,
        line.productId,
        line.name,
        line.price,
        line.start,
        line.added,
        line.waste,
        line.stock,
        line.sales,
        line.total,
      ]
    );
  }
};

export const getAllBalances = async (): Promise<Balance[]> => {
  const db = getDatabase();
  const balances = await db.getAllAsync(
    `SELECT id, name, date, total FROM balances ORDER BY date DESC`
  );

  const result: Balance[] = [];
  for (const balance of balances as any[]) {
    const lines = await db.getAllAsync(
      `SELECT product_id, name, price, start, added, waste, stock, sales, total FROM balance_lines WHERE balance_id = ?`,
      [balance.id]
    );

    result.push({
      id: balance.id,
      name: balance.name,
      date: balance.date,
      total: balance.total,
      lines: lines as BalanceLine[],
    });
  }

  return result;
};

export const getBalanceById = async (balanceId: string): Promise<Balance | null> => {
  const db = getDatabase();
  const balance = await db.getFirstAsync(
    `SELECT id, name, date, total FROM balances WHERE id = ?`,
    [balanceId]
  );

  if (!balance) return null;

  const lines = await db.getAllAsync(
    `SELECT product_id, name, price, start, added, waste, stock, sales, total FROM balance_lines WHERE balance_id = ?`,
    [balanceId]
  );

  return {
    id: (balance as any).id,
    name: (balance as any).name,
    date: (balance as any).date,
    total: (balance as any).total,
    lines: lines as BalanceLine[],
  };
};

/**
 * Limpia cuadres antiguos (más de 90 días)
 */
export const cleanOldBalances = async (): Promise<void> => {
  const db = getDatabase();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const cutoffDate = ninetyDaysAgo.toISOString();

  // Obtener IDs de cuadres antiguos
  const oldBalances = await db.getAllAsync(
    `SELECT id FROM balances WHERE date < ?`,
    [cutoffDate]
  );

  // Eliminar líneas de esos cuadres
  for (const balance of oldBalances as any[]) {
    await db.runAsync(`DELETE FROM balance_lines WHERE balance_id = ?`, [balance.id]);
  }

  // Eliminar los cuadres
  await db.runAsync(`DELETE FROM balances WHERE date < ?`, [cutoffDate]);

  console.log(`🧹 Limpiados ${oldBalances.length} cuadres antiguos`);
};
