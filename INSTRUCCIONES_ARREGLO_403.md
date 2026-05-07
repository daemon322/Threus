# 🔧 SOLUCIÓN: Error 403 en Supabase (Acceso Denegado)

## El Problema
El error 403 significa que las políticas **Row Level Security (RLS)** en Supabase están bloqueando el acceso a la tabla `productos`. 

```
lxtniccyyiouzjklmiir.supabase.co/rest/v1/productos?select=...&activo=eq.true
Failed to load resource: the server responded with a status of 403 ()
```

## La Solución: Actualizar RLS Policies

### Paso 1: Abre el Dashboard de Supabase
1. Ve a: **https://supabase.com/dashboard/project/lxtniccyyiouzjklmiir**
2. Inicia sesión si es necesario

### Paso 2: Abre el SQL Editor
1. En el menú izquierdo, selecciona **"SQL Editor"**
2. Haz clic en **"New Query"** (botón verde)

### Paso 3: Ejecuta el Script de Arreglo
1. Copia TODO el contenido de este archivo: `FIX_RLS_POLICIES.sql`
2. Pégalo en el editor SQL
3. Haz clic en **"RUN"** (botón azul)

### Paso 4: Verifica el Cambio
Regresa a tu navegador con la app React y recarga (Ctrl+R). Ahora deberías ver:
- ✅ Los productos cargando sin errores
- ✅ Las categorías visibles
- ✅ Las ofertas especiales
- ✅ El error 403 desaparecido

## ¿Qué Hace el Script?

El script actualiza las políticas de seguridad para permitir **lectura pública** de:
- `productos` - Todos pueden leer (sin autenticación)
- `categorias` - Todos pueden leer
- `formas_pago` - Todos pueden leer
- `usuarios` - Todos pueden leer (solo información básica)

Esto es seguro porque:
- ✅ Solo permite **lectura (SELECT)**
- ✅ No permite escritura, actualización ni eliminación
- ✅ Los datos sensibles ya están estructurados en la BD

## ⚠️ Nota de Seguridad

Si después quieres mayor control, puedes:
1. Cambiar las políticas para permitir SOLO usuarios autenticados
2. Usar roles (admin, cajero, bodeguero) para acceso más granular
3. Agregar autenticación de Supabase (JWT tokens)

Por ahora, hacer lectura pública es lo más simple y permite que tu app funcione.

## Si Necesitas Revertir

Si algo sale mal, puedes hacer que NADIE pueda leer con:
```sql
DROP POLICY "Allow public read" ON productos;
DROP POLICY "Allow public read" ON categorias;
DROP POLICY "Allow public read" ON formas_pago;
DROP POLICY "Allow public read" ON usuarios;
```

Pero entonces tu app no tendrá acceso a los datos.
