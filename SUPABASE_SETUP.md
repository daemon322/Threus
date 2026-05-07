# Configuración de Supabase en Threus

Este documento explica cómo conectar tu aplicación React con Supabase para obtener datos reales de la base de datos del minimarket.

## 📋 Requisitos

1. Una cuenta de Supabase (https://supabase.com)
2. El script de base de datos (`database-minimarket.MD`) ejecutado en Supabase
3. Node.js y npm instalados

## 🚀 Pasos de Configuración

### 1. Crear un Proyecto en Supabase

- Ve a https://supabase.com/dashboard
- Haz clic en "New project"
- Selecciona tu organización
- Completa los detalles del proyecto
- Espera a que se cree el proyecto

### 2. Ejecutar el Script de Base de Datos

- En el dashboard de Supabase, abre el **SQL Editor**
- Crea una nueva query
- Copia y pega el contenido del archivo `database-minimarket.MD`
- Haz clic en "Run" para ejecutar el script
- Espera a que se completen todas las sentencias SQL

### 3. Obtener las Credenciales

1. Ve a **Project Settings** (engranaje abajo a la izquierda)
2. Selecciona **API** en el menú
3. Encontrarás:
   - **Project URL**: Tu URL de Supabase
   - **anon public**: Tu llave pública anónima

### 4. Configurar Variables de Entorno

1. En la raíz del proyecto, crea un archivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Reemplaza:
- `your-project` con el nombre de tu proyecto
- `your-anon-key` con la llave pública que copiaste

2. **Nunca** compartas estas credenciales en GitHub. El archivo `.env.local` está en `.gitignore`

### 5. Instalar Dependencias

```bash
npm install
```

(Si ya lo hiciste, puedes saltar este paso)

### 6. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación debería conectarse a Supabase automáticamente.

## 📁 Estructura de Servicios

Todos los servicios están en `src/services/`:

| Archivo | Descripción |
|---------|-------------|
| `supabase.js` | Configuración del cliente Supabase |
| `productosService.js` | Obtener, buscar productos |
| `categoriasService.js` | Obtener categorías |
| `ventasService.js` | Crear ventas y detalles |
| `clientesService.js` | Gestión de clientes |
| `usuariosService.js` | Gestión de usuarios (cajeros, admin) |

## 🔗 Uso en Componentes

### Cargar Productos

```javascript
import { loadProducts } from "../data/products";

const fetchProductos = async () => {
  const productos = await loadProducts();
  console.log(productos);
};
```

### Crear una Venta

```javascript
import { crearVenta } from "../services/ventasService";

const resultado = await crearVenta({
  usuario_id: "uuid-del-cajero",
  cliente_id: "uuid-del-cliente",
  forma_pago_id: "uuid-del-pago",
  detalles: cart, // Array de productos en el carrito
  total: 150.50,
  descuento: 0,
  iva: 0,
});

if (resultado.success) {
  console.log("Venta registrada:", resultado.venta);
}
```

### Buscar Clientes

```javascript
import { getClienteByDocumento } from "../services/clientesService";

const cliente = await getClienteByDocumento("12345678");
```

## 🛠️ Solución de Problemas

### Error: "Las variables de entorno de Supabase no están configuradas"

**Solución**: Verifica que el archivo `.env.local` existe y tiene las credenciales correctas.

### Error de conexión a Supabase

**Soluciones posibles**:
1. Verifica que tu URL de Supabase sea correcta
2. Verifica que la llave anónima es válida
3. Asegúrate de que el script SQL se ejecutó correctamente

### Los productos no cargan

**Soluciones posibles**:
1. Verifica que la tabla `productos` tiene datos
2. En Supabase, ve a **Table Editor** y confirma que hay productos activos
3. Revisa la consola del navegador (F12) para ver mensajes de error

### Las ventas no se registran

**Soluciones posibles**:
1. Verifica que existe un usuario en la tabla `usuarios`
2. Verifica que existe una forma de pago en `formas_pago`
3. Verifica que existe un cliente en `clientes` (o usa NULL para consumidor final)
4. Revisa los mensajes de error en la consola

## 📊 Datos Iniciales

El script SQL ya incluye:
- ✅ 5 formas de pago (Efectivo, Tarjeta de Crédito, Tarjeta de Débito, Transferencia, Crédito)
- ✅ 8 categorías de productos
- ✅ 1 usuario administrador
- ✅ 1 cliente "Consumidor Final"
- ✅ 3 productos de ejemplo

Puedes agregar más datos usando:
- El **Table Editor** de Supabase
- El formulario en tu aplicación React
- Queries SQL adicionales

## 🔒 Seguridad (RLS - Row Level Security)

El script ya incluye políticas RLS que:
- Permiten lectura pública de productos
- Solo administradores pueden crear/editar productos
- Los cajeros solo ven sus propias ventas
- Los usuarios solo ven su propio perfil

Para ajustar permisos, edita las políticas en Supabase en el apartado de **Authentication > Policies**.

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12 > Console)
2. Revisa los logs de Supabase (Dashboard > Logs)
3. Verifica que el script SQL se ejecutó correctamente
4. Confirma que las credenciales en `.env.local` son correctas

---

**¡Listo!** Tu aplicación Threus ahora está conectada a Supabase y lista para vender en tiempo real. 🎉
