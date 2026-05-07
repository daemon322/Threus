# Guía Rápida - Usar Servicios de Supabase

## 🎯 Ejemplos de Uso Común

### 1. Cargar Todos los Productos

```javascript
import { loadProducts } from "../data/products";

export const MisProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const datos = await loadProducts();
      setProductos(datos);
    };
    cargar();
  }, []);

  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre} - S/ {p.precio}</li>
      ))}
    </ul>
  );
};
```

### 2. Buscar un Producto

```javascript
import { buscarProductos } from "../services/productosService";

const resultados = await buscarProductos("arroz");
console.log(resultados);
```

### 3. Obtener Productos por Categoría

```javascript
import { getProductosByCategoria } from "../services/productosService";

// Primero obtén el ID de la categoría
const categoriasData = await getCategorias();
const categoriaAbarrotes = categoriasData.find(c => c.nombre === "Abarrotes");

// Luego obtén productos de esa categoría
const productos = await getProductosByCategoria(categoriaAbarrotes.id);
```

### 4. Crear una Venta

```javascript
import { crearVenta } from "../services/ventasService";
import { getFormasPago } from "../services/ventasService";
import { getClienteConsumidorFinal } from "../services/clientesService";

const procesarCompra = async (cart, usuarioId) => {
  // Obtener forma de pago (efectivo)
  const formasPago = await getFormasPago();
  const efectivo = formasPago.find(f => f.nombre === "Efectivo");

  // Obtener cliente consumidor final
  const clienteId = await getClienteConsumidorFinal();

  // Crear venta
  const resultado = await crearVenta({
    usuario_id: usuarioId,
    cliente_id: clienteId,
    forma_pago_id: efectivo.id,
    detalles: cart,
    total: 150.50,
    descuento: 0,
    iva: 0,
    observaciones: "Compra de mostrador"
  });

  if (resultado.success) {
    console.log("✅ Venta creada con folio:", resultado.venta.folio);
  } else {
    console.error("❌ Error:", resultado.error);
  }
};
```

### 5. Registrar un Nuevo Cliente

```javascript
import { crearCliente } from "../services/clientesService";

const nuevoCliente = await crearCliente({
  tipo_documento: "DNI",
  numero_documento: "12345678",
  nombres: "Juan",
  apellidos: "Pérez",
  telefono: "987654321",
  email: "juan@example.com",
  direccion: "Av. Principal 123"
});

if (nuevoCliente.success) {
  console.log("✅ Cliente creado:", nuevoCliente.cliente.id);
}
```

### 6. Obtener Historial de Ventas

```javascript
import { getVentas, getDetallesVenta } from "../services/ventasService";

// Obtener últimas 50 ventas
const ventas = await getVentas(50);

// Obtener detalles de una venta específica
const detalles = await getDetallesVenta(ventas[0].id);
console.log("Productos en la venta:", detalles);
```

## 🪝 Hooks Personalizados

### useProductos

```javascript
import useProductos from "../hooks/useProductos";

export const MiComponente = () => {
  const { productos, loading, error, recargar } = useProductos();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div>
        {productos.map(p => <ProductCard key={p.id} producto={p} />)}
      </div>
      <button onClick={recargar}>Recargar</button>
    </>
  );
};
```

### useFormasPago

```javascript
import useFormasPago from "../hooks/useFormasPago";

export const CheckoutForm = () => {
  const { formasPago, loading } = useFormasPago();

  return (
    <select>
      {formasPago.map(fp => (
        <option key={fp.id} value={fp.id}>
          {fp.nombre}
        </option>
      ))}
    </select>
  );
};
```

### useUsuarios

```javascript
import useUsuarios from "../hooks/useUsuarios";

export const CajeroSelector = () => {
  const { usuarios, loading } = useUsuarios();

  return (
    <select>
      {usuarios.map(u => (
        <option key={u.id} value={u.id}>
          {u.nombre_completo} ({u.rol})
        </option>
      ))}
    </select>
  );
};
```

## 🔄 Integración con CartContext

El `CartContext` ahora incluye `procesarVenta`:

```javascript
import { useCart } from "../context/CartContext";

export const CheckoutButton = ({ usuarioId, formasPagoId, clienteId }) => {
  const { procesarVenta, creatingVenta, ventaError, ventaSuccess } = useCart();

  const handleCheckout = async () => {
    const resultado = await procesarVenta({
      usuario_id: usuarioId,
      cliente_id: clienteId,
      forma_pago_id: formasPagoId,
      descuento: 0,
      iva: 0,
    });

    if (resultado.success) {
      console.log("✅ Venta exitosa, folio:", resultado.venta.folio);
    }
  };

  return (
    <>
      <button 
        onClick={handleCheckout} 
        disabled={creatingVenta}
      >
        {creatingVenta ? "Procesando..." : "Finalizar Compra"}
      </button>
      {ventaError && <p className="text-red-600">{ventaError}</p>}
      {ventaSuccess && <p className="text-green-600">{ventaSuccess}</p>}
    </>
  );
};
```

## 📊 Estructura de Datos

### Producto
```javascript
{
  id: "uuid",
  nombre: "Arroz Extra 1kg",
  descripcion: "Descripción...",
  precio: 4.50,           // precio_venta
  stock: 120,             // stock_actual
  unidad: "kg",
  categoria: "Abarrotes",
  imagen: "/assets/images/producto-uuid.png"
}
```

### Venta
```javascript
{
  id: "uuid",
  folio: 1,
  fecha: "2024-01-15T10:30:00Z",
  total: 150.50,
  descuento: 0,
  iva: 0,
  estado: "completada",
  clientes: { nombres: "Juan", apellidos: "Pérez" },
  formas_pago: { nombre: "Efectivo" },
  usuarios: { nombre_completo: "Carlos Rodriguez" }
}
```

### Detalle de Venta
```javascript
{
  id: "uuid",
  cantidad: 2,
  precio_unitario: 4.50,
  descuento: 0,
  subtotal: 9.00,
  productos: { id: "uuid", nombre: "Arroz Extra 1kg", codigo_barras: "789123" }
}
```

## ⚠️ Errores Comunes

### Error: "Stock insuficiente"
Este error viene de Supabase cuando intentes vender más de lo disponible.
**Solución**: Verifica el stock antes de procesar la venta.

### Error: "No rows found"
Significa que no encontró el registro solicitado (cliente, usuario, forma de pago, etc.).
**Solución**: Verifica que el ID existe en Supabase.

### Error: "Permission denied"
Las políticas RLS dieron permiso denegado.
**Solución**: Revisa los permisos en Supabase > Authentication > Policies.

---

¡Para más detalles, revisa el archivo `SUPABASE_SETUP.md`!
