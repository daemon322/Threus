# 🚀 INICIO RÁPIDO - Threus + Supabase

## ⏱️ 5 Pasos para Empezar en 5 Minutos

### Paso 1: Configurar Supabase (2 min)

1. Ve a https://supabase.com/dashboard
2. Crea un nuevo proyecto (sigue los pasos)
3. Una vez creado, abre el **SQL Editor**
4. Copia TODO el contenido de `database-minimarket.MD`
5. Pégalo en la query y presiona **Run**
6. Espera a que termine (verás ✓ verde en cada sentencia)

### Paso 2: Obtener Credenciales (1 min)

1. En Supabase, ve a **Project Settings** (engranaje abajo)
2. Haz clic en **API**
3. Copia la URL (Project URL)
4. Copia la llave (anon public)
5. Abre tu proyecto en VS Code

### Paso 3: Configurar .env.local (1 min)

1. En la raíz de tu proyecto (junto a package.json), crea un archivo llamado `.env.local`
2. Copia esto:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Reemplaza `your-project` y `your-anon-key-here` con lo que copiaste
4. Guarda el archivo

### Paso 4: Instalar y Ejecutar (1 min)

```bash
cd "c:\Users\DEMON\Downloads\React\Threus"
npm install  # Si no lo hiciste ya
npm run dev
```

Verás algo como:
```
  ➜  Local:   http://localhost:5174/Threus
```

### Paso 5: Probar (verificar) 

1. Abre http://localhost:5174/Threus en tu navegador
2. Deberías ver productos cargándose
3. Prueba agregar un producto al carrito
4. ¡Listo!

---

## ✅ Verificación de Funcionamiento

### ✓ Los productos cargan desde Supabase
- Ve a la home y espera 2-3 segundos
- Si ves productos, ¡funciona!

### ✓ El carrito guarda datos
- Agrega un producto
- Recarga la página (F5)
- El producto se mantiene en el carrito

### ✓ Las ventas se registran
- Agrega productos al carrito
- Ve a `/carrito`
- Intenta "Finalizar compra" (necesitarás usuario y forma de pago)

---

## 🆘 Si Algo No Funciona

### Error: "Variables de entorno no configuradas"
- Verifica que `.env.local` existe
- Verifica que tiene las credenciales correctas
- Reinicia `npm run dev`

### Los productos no cargan
- Abre DevTools (F12 > Network)
- Revisa si hay error de conexión
- Verifica que el script SQL se ejecutó en Supabase
- Revisa que en Supabase > Table Editor > productos hay datos

### Error en Supabase SQL
- Copia SOLO desde `-- ======================================================` hasta el final
- No copies nada antes de eso
- Ejecuta en el SQL Editor de Supabase

---

## 📚 Documentación Completa

- **SUPABASE_SETUP.md** - Guía detallada de configuración
- **SERVICIOS_QUICK_REFERENCE.md** - Ejemplos de código para desarrolladores
- **CAMBIOS_REALIZADOS.md** - Lista completa de cambios en el proyecto

---

## 🎯 Próximas Acciones

Después de verificar que funciona:

1. **Crear un admin panel** - Para gestionar productos y usuarios
2. **Implementar autenticación** - Con Supabase Auth
3. **Crear reportes** - De ventas diarias
4. **Mejorar UI** - Agregar fotos reales de productos

---

## 💬 Información Importante

- **Credenciales**: Nunca compartir `.env.local` en GitHub
- **Stock**: Se actualiza automáticamente al vender
- **Ventas**: Se guardan con todas las details y folio único
- **Usuarios**: Solo el admin puede crear otros usuarios

---

**¡Ahora sí! Tu Threus está conectado a Supabase y listo para vender.** 🎉

¿Preguntas? Revisa la documentación o contacta al desarrollador.
