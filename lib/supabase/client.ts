import { createClient } from '@supabase/supabase-js';
import { User } from '../../types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Valida una clave de acceso contra Supabase
 */
export const validateAccessKey = async (accessKey: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('access_key', accessKey)
      .single();

    if (error || !data) {
      console.error('❌ Error validating key:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('❌ Validation error:', error);
    return null;
  }
};

/**
 * Obtiene todos los usuarios (solo para Admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');

    if (error) {
      console.error('❌ Error fetching users:', error);
      return [];
    }

    return data as User[];
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
};

/**
 * Crea un nuevo usuario (solo para Admin)
 */
export const createUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const { data, error } = await supabase.from('profiles').insert([user]).select().single();

    if (error) {
      console.error('❌ Error creating user:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

/**
 * Actualiza un usuario
 */
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating user:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

/**
 * Obtiene mensajes de un usuario
 */
export const getMessages = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
};

/**
 * Envía un mensaje a un usuario
 */
export const sendMessage = async (
  userId: string,
  title: string,
  body: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('messages').insert([{ user_id: userId, title, body }]);

    if (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
};

/**
 * Valida la contraseña de admin
 */
export const validateAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('admin_password')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.error('❌ Error validating admin password:', error);
      return false;
    }

    // En producción, aquí irían comparaciones de hash (bcrypt, argon2, etc.)
    // Por ahora, comparación simple
    return password === (data as any).admin_password;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
};
