# Guía de Configuración de Supabase

## 1. Crear Cuenta en Supabase

Va a [supabase.com](https://supabase.com) y crea una nueva cuenta.

## 2. Crear Proyecto

1. Click en "New Project"
2. Completa:
   - **Name**: Tu proyecto
   - **Database Password**: Contraseña fuerte
   - **Region**: Elige la más cercana
3. Espera a que se cree (5-10 minutos)

## 3. Obtener Credenciales

1. Ve a **Settings → API**
2. Copia:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 4. Crear Tablas

Va a **SQL Editor** y ejecuta:

```sql
-- Tabla de perfiles/usuarios
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  access_key text NOT NULL UNIQUE,
  device_id text,
  expiration_date timestamp,
  is_blocked boolean DEFAULT false,
  role text DEFAULT 'user',
  payment_date timestamp,
  created_at timestamp DEFAULT now()
);

-- Tabla de mensajes
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Tabla de configuración admin
CREATE TABLE admin_settings (
  id integer PRIMARY KEY DEFAULT 1,
  admin_password text,
  updated_at timestamp DEFAULT now()
);

-- Insertar configuración inicial
INSERT INTO admin_settings (admin_password) VALUES ('admin123');
```

## 5. Configurar Políticas RLS

En **Authentication → Policies**:

```sql
-- Usuarios pueden leer sus propios datos
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id OR role = 'admin');

-- Usuarios pueden leer sus mensajes
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  USING (auth.uid() = user_id OR role = 'admin');
```

## 6. Configurar Variables de Entorno

En `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## ✅ ¡Listo!

Ahora puedes usar Supabase en la app.
