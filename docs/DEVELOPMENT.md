# Guía de Desarrollo

## 🚀 Empezar

```bash
# Clonar repositorio
git clone https://github.com/kevinelpesetaveo-droid/BizBag.git
cd BizBag

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# Iniciar desarrollo
npm start
```

## 📋 Estructura de Código

### `/app` - Rutas (Expo Router)

Cada archivo `.tsx` en esta carpeta es una ruta automáticamente. Ejemplo:

```
app/
├── index.tsx → /
├── admin.tsx → /admin
└── (tabs)/
    ├── _layout.tsx → Define el layout de tabs
    ├── dashboard.tsx → /(tabs)/dashboard
    └── products.tsx → /(tabs)/products
```

### `/components/ui` - Componentes Reutilizables

Componentes que se usan en múltiples pantallas:

```typescript
// Ejemplo: Button.tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
}) => { ... };
```

### `/lib` - Lógica de Negocio

#### `/lib/store/useBizBagStore.ts`

Store global con Zustand. Acceso desde cualquier componente:

```typescript
const { products, addProduct } = useBizBagStore();
```

#### `/lib/database/init.ts`

Operaciones SQLite:

```typescript
const products = await db.getAllProducts();
await db.addProduct(product);
```

#### `/lib/supabase/client.ts`

Operaciones Supabase:

```typescript
const user = await supabaseClient.validateAccessKey(key);
```

#### `/lib/utils/helpers.ts`

Funciones utilitarias:

```typescript
const stock = available(inventory);
const formatted = formatMoney(1000); // $1,000
```

### `/types` - TypeScript Types

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
```

## 🎨 Estilos con NativeWind

Usamos Tailwind CSS en React Native. Ejemplos:

```tsx
<View className="flex-1 bg-primary rounded-card p-4 mb-3">
  <Text className="text-white text-lg font-bold">Hola</Text>
</View>
```

### Colores Personalizados

En `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#2A9D8F',
      background: '#F5F7FA',
      // ...
    },
  },
},
```

## 🔄 Flujo de Datos

```
Componente
    ↓
usa useBizBagStore
    ↓
Store dispara acción
    ↓
Acción actualiza estado
    ↓
Componente se re-renderiza
```

Ejemplo:

```typescript
const { products, addProduct } = useBizBagStore();

const handleAdd = async () => {
  await addProduct({ name: 'Pan', price: 20, category: 'Harina' });
  // Store se actualiza automáticamente
  // Componente se re-renderiza con nuevo producto
};
```

## 📝 Crear Nueva Pantalla

### 1. Crear archivo en `/app`

```typescript
// app/my-screen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/ui/TopBar';

export default function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Mi Pantalla" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground text-lg font-bold">¡Hola!</Text>
      </View>
    </SafeAreaView>
  );
}
```

### 2. Navegar desde otra pantalla

```typescript
import { Link } from 'expo-router';

<Link href="/my-screen" asChild>
  <TouchableOpacity>
    <Text>Ir a Mi Pantalla</Text>
  </TouchableOpacity>
</Link>
```

## 🧪 Testing

```bash
npm test
```

Escribe tests en archivos `.test.ts` o `.test.tsx`:

```typescript
// lib/utils/helpers.test.ts
import { available } from './helpers';

describe('available', () => {
  it('calcula stock disponible', () => {
    const result = available({ start: 10, added: 5, waste: 2 });
    expect(result).toBe(13);
  });
});
```

## 🐛 Debugging

### React Native Debugger

1. Descarga [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
2. Abre con tu app
3. Presiona `Cmd+D` (iOS) o `Cmd+M` (Android)
4. Selecciona "Debug with Chrome"

### Logs

```typescript
console.log('Debug:', value);
console.warn('Warning:', value);
console.error('Error:', value);
```

## 📱 Emuladores

### iOS

```bash
npm run ios
```

### Android

```bash
# Primero abre Android Studio y crea un emulador
npm run android
```

## 🚀 Build para Producción

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 📚 Recursos

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Supabase](https://supabase.com/docs)

## 💡 Tips

1. **Hot Reload**: Los cambios se aplican automáticamente
2. **TypeScript**: Aprovecha el tipado para evitar errores
3. **Components**: Crea componentes pequeños y reutilizables
4. **Store**: Centraliza el estado en Zustand
5. **Naming**: Usa nombres descriptivos (camelCase para variables, PascalCase para componentes)
