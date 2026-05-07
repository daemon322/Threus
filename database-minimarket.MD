-- ======================================================
-- SISTEMA DE VENTAS PARA MINIMARKET - SUPABASE
-- ======================================================
-- Este script crea todas las tablas, índices, restricciones,
-- políticas de seguridad (RLS) y triggers necesarios.
-- Está diseñado para ser ejecutado en el Editor SQL de Supabase.

-- ======================================================
-- 1. EXTENSIONES NECESARIAS
-- ======================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================
-- 2. TABLAS PRINCIPALES
-- ======================================================

-- CATEGORÍAS DE PRODUCTOS
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROVEEDORES
CREATE TABLE proveedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_comercial VARCHAR(150) NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    contacto_nombre VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTOS
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_barras VARCHAR(50) UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    proveedor_id UUID REFERENCES proveedores(id) ON DELETE SET NULL,
    precio_compra DECIMAL(12,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta DECIMAL(12,2) NOT NULL CHECK (precio_venta >= 0),
    stock_actual DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo DECIMAL(12,2) DEFAULT 0,
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTES (personas naturales o empresas que compran)
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_documento VARCHAR(10) CHECK (tipo_documento IN ('DNI', 'RUC', 'CE', 'PASAPORTE')),
    numero_documento VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    razon_social VARCHAR(150),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USUARIOS (empleados / cajeros / administradores)
-- Se integra con auth.users de Supabase opcionalmente, pero aquí creamos tabla propia
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- integración con auth de Supabase
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('admin', 'cajero', 'bodeguero', 'gerente')),
    activo BOOLEAN DEFAULT true,
    ultimo_acceso TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FORMAS DE PAGO (catálogo)
CREATE TABLE formas_pago (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,  -- 'efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'credito'
    requiere_validacion BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true
);

-- VENTAS (cabecera)
CREATE TABLE ventas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folio SERIAL UNIQUE,  -- número correlativo visible
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    forma_pago_id UUID NOT NULL REFERENCES formas_pago(id),
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    descuento DECIMAL(12,2) DEFAULT 0 CHECK (descuento >= 0),
    iva DECIMAL(12,2) DEFAULT 0,
    estado VARCHAR(20) NOT NULL DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'anulada')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DETALLE DE VENTAS
CREATE TABLE detalles_venta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad DECIMAL(12,2) NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    descuento DECIMAL(12,2) DEFAULT 0 CHECK (descuento >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS ((precio_unitario - descuento) * cantidad) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMPRAS A PROVEEDORES
CREATE TABLE compras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_factura VARCHAR(50) UNIQUE,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    iva DECIMAL(12,2) DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'registrada' CHECK (estado IN ('registrada', 'pagada', 'anulada')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DETALLE DE COMPRAS
CREATE TABLE detalles_compra (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    compra_id UUID NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad DECIMAL(12,2) NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOVIMIENTOS DE STOCK (auditoría)
CREATE TABLE movimientos_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste')),
    cantidad DECIMAL(12,2) NOT NULL,
    referencia_tipo VARCHAR(30), -- 'venta', 'compra', 'ajuste'
    referencia_id UUID,           -- id de la venta, compra, etc.
    stock_previo DECIMAL(12,2) NOT NULL,
    stock_nuevo DECIMAL(12,2) NOT NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CIERRES DE CAJA (para turnos cajeros)
CREATE TABLE cierres_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    fecha_apertura TIMESTAMPTZ NOT NULL,
    fecha_cierre TIMESTAMPTZ,
    monto_apertura DECIMAL(12,2) NOT NULL CHECK (monto_apertura >= 0),
    monto_cierre DECIMAL(12,2),
    total_ventas DECIMAL(12,2) DEFAULT 0,
    total_efectivo DECIMAL(12,2),
    diferencia DECIMAL(12,2),
    estado VARCHAR(15) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================
-- 3. ÍNDICES PARA RENDIMIENTO (ESCALABILIDAD)
-- ======================================================
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_stock ON productos(stock_actual);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_detalles_venta_venta ON detalles_venta(venta_id);
CREATE INDEX idx_detalles_venta_producto ON detalles_venta(producto_id);
CREATE INDEX idx_compras_fecha ON compras(fecha);
CREATE INDEX idx_compras_proveedor ON compras(proveedor_id);
CREATE INDEX idx_movimientos_stock_producto ON movimientos_stock(producto_id);
CREATE INDEX idx_movimientos_stock_fecha ON movimientos_stock(created_at);
CREATE INDEX idx_clientes_numero_documento ON clientes(numero_documento);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_cierres_caja_fecha ON cierres_caja(fecha_apertura);

-- ======================================================
-- 4. TRIGGERS PARA ACTUALIZAR updated_at
-- ======================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compras_updated_at BEFORE UPDATE ON compras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================================
-- 5. FUNCIONES Y TRIGGERS PARA ACTUALIZAR STOCK AUTOMÁTICAMENTE
-- ======================================================
-- Actualizar stock al insertar detalle de venta (salida)
CREATE OR REPLACE FUNCTION actualizar_stock_por_venta()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual_producto DECIMAL(12,2);
BEGIN
    -- Obtener stock actual del producto
    SELECT stock_actual INTO stock_actual_producto FROM productos WHERE id = NEW.producto_id;
    
    -- Validar que haya suficiente stock
    IF stock_actual_producto < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.producto_id;
    END IF;
    
    -- Actualizar stock
    UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id = NEW.producto_id;
    
    -- Registrar movimiento de stock
    INSERT INTO movimientos_stock (producto_id, tipo_movimiento, cantidad, referencia_tipo, referencia_id, stock_previo, stock_nuevo, usuario_id)
    VALUES (
        NEW.producto_id,
        'salida',
        NEW.cantidad,
        'venta',
        NEW.venta_id,
        stock_actual_producto,
        stock_actual_producto - NEW.cantidad,
        (SELECT usuario_id FROM ventas WHERE id = NEW.venta_id)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock_venta
AFTER INSERT ON detalles_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_por_venta();

-- Actualizar stock al insertar detalle de compra (entrada)
CREATE OR REPLACE FUNCTION actualizar_stock_por_compra()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual_producto DECIMAL(12,2);
BEGIN
    SELECT stock_actual INTO stock_actual_producto FROM productos WHERE id = NEW.producto_id;
    
    UPDATE productos SET stock_actual = stock_actual + NEW.cantidad WHERE id = NEW.producto_id;
    
    INSERT INTO movimientos_stock (producto_id, tipo_movimiento, cantidad, referencia_tipo, referencia_id, stock_previo, stock_nuevo, usuario_id)
    VALUES (
        NEW.producto_id,
        'entrada',
        NEW.cantidad,
        'compra',
        NEW.compra_id,
        stock_actual_producto,
        stock_actual_producto + NEW.cantidad,
        (SELECT usuario_id FROM compras WHERE id = NEW.compra_id)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_stock_compra
AFTER INSERT ON detalles_compra
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_por_compra();

-- ======================================================
-- 6. ROW LEVEL SECURITY (RLS) - SEGURIDAD CRÍTICA
-- ======================================================
-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE formas_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE cierres_caja ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ejemplo de seguridad por roles)
-- Se asume que la aplicación gestiona la autenticación y el JWT contiene el rol del usuario.
-- Aquí se crean políticas que permiten SELECT a todos los usuarios autenticados,
-- pero modificaciones solo según rol. Ajustar según necesidades reales.

-- Función helper para obtener rol del usuario actual (de la tabla usuarios)
CREATE OR REPLACE FUNCTION user_rol()
RETURNS VARCHAR AS $$
BEGIN
    RETURN (SELECT rol FROM usuarios WHERE auth_user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para CATEGORIAS
CREATE POLICY "Lectura pública de categorías" ON categorias FOR SELECT USING (true);
CREATE POLICY "Escritura solo admin" ON categorias FOR INSERT WITH CHECK (user_rol() = 'admin');
CREATE POLICY "Actualización solo admin" ON categorias FOR UPDATE USING (user_rol() = 'admin');
CREATE POLICY "Eliminación solo admin" ON categorias FOR DELETE USING (user_rol() = 'admin');

-- Políticas para PROVEEDORES
CREATE POLICY "Lectura para todos autenticados" ON proveedores FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Escritura admin o gerente" ON proveedores FOR INSERT WITH CHECK (user_rol() IN ('admin', 'gerente'));
CREATE POLICY "Actualización admin o gerente" ON proveedores FOR UPDATE USING (user_rol() IN ('admin', 'gerente'));
CREATE POLICY "Eliminación solo admin" ON proveedores FOR DELETE USING (user_rol() = 'admin');

-- Políticas para PRODUCTOS
CREATE POLICY "Lectura productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Escritura productos admin/gerente/bodeguero" ON productos FOR INSERT WITH CHECK (user_rol() IN ('admin', 'gerente', 'bodeguero'));
CREATE POLICY "Actualización productos admin/gerente/bodeguero" ON productos FOR UPDATE USING (user_rol() IN ('admin', 'gerente', 'bodeguero'));
CREATE POLICY "Eliminación lógica solo admin" ON productos FOR DELETE USING (user_rol() = 'admin');

-- Políticas para CLIENTES
CREATE POLICY "Lectura clientes autenticados" ON clientes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Modificación clientes admin/gerente/cajero" ON clientes FOR INSERT WITH CHECK (user_rol() IN ('admin', 'gerente', 'cajero'));
CREATE POLICY "Actualización clientes admin/gerente/cajero" ON clientes FOR UPDATE USING (user_rol() IN ('admin', 'gerente', 'cajero'));

-- Políticas para USUARIOS (cada usuario solo ve su propio registro excepto admin)
CREATE POLICY "Usuarios ven su propio perfil" ON usuarios FOR SELECT USING (auth.uid() = auth_user_id OR user_rol() = 'admin');
CREATE POLICY "Solo admin modifica usuarios" ON usuarios FOR UPDATE USING (user_rol() = 'admin');
CREATE POLICY "Solo admin inserta usuarios" ON usuarios FOR INSERT WITH CHECK (user_rol() = 'admin');

-- Políticas para VENTAS
CREATE POLICY "Cajeros y admin ven todas las ventas" ON ventas FOR SELECT USING (user_rol() IN ('admin', 'gerente', 'cajero'));
CREATE POLICY "Cajeros pueden insertar ventas" ON ventas FOR INSERT WITH CHECK (user_rol() IN ('admin', 'cajero'));
CREATE POLICY "Solo admin anular ventas" ON ventas FOR UPDATE USING (user_rol() = 'admin');

-- Políticas para DETALLES VENTA
CREATE POLICY "Detalles visibles según acceso a ventas" ON detalles_venta FOR SELECT USING (EXISTS (SELECT 1 FROM ventas WHERE ventas.id = venta_id AND (user_rol() IN ('admin', 'gerente', 'cajero'))));
CREATE POLICY "Insercion de detalles al hacer venta" ON detalles_venta FOR INSERT WITH CHECK (user_rol() IN ('admin', 'cajero'));

-- Políticas para COMPRAS
CREATE POLICY "Compras visibles admin/gerente" ON compras FOR SELECT USING (user_rol() IN ('admin', 'gerente'));
CREATE POLICY "Compras insert admin/gerente" ON compras FOR INSERT WITH CHECK (user_rol() IN ('admin', 'gerente'));

-- Políticas para MOVIMIENTOS STOCK (solo lectura)
CREATE POLICY "Stock movements visible admin/gerente/bodeguero" ON movimientos_stock FOR SELECT USING (user_rol() IN ('admin', 'gerente', 'bodeguero'));

-- Políticas para CIERRES CAJA
CREATE POLICY "Cierres visibles admin/gerente/cajero propio" ON cierres_caja FOR SELECT USING (user_rol() IN ('admin', 'gerente') OR usuario_id = (SELECT id FROM usuarios WHERE auth_user_id = auth.uid()));
CREATE POLICY "Cajeros pueden crear cierre apertura" ON cierres_caja FOR INSERT WITH CHECK (user_rol() IN ('admin', 'cajero'));
CREATE POLICY "Actualización solo para cerrar" ON cierres_caja FOR UPDATE USING (user_rol() IN ('admin', 'cajero'));

-- ======================================================
-- 7. DATOS INICIALES (CATÁLOGOS Y USUARIO DEMO)
-- ======================================================
-- Insertar formas de pago básicas
INSERT INTO formas_pago (id, nombre, requiere_validacion) VALUES
    (uuid_generate_v4(), 'Efectivo', false),
    (uuid_generate_v4(), 'Tarjeta de Crédito', true),
    (uuid_generate_v4(), 'Tarjeta de Débito', true),
    (uuid_generate_v4(), 'Transferencia Bancaria', false),
    (uuid_generate_v4(), 'Crédito Interno', false);

-- Insertar categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Abarrotes', 'Productos no perecibles envasados'),
    ('Lácteos', 'Leche, quesos, yogures'),
    ('Bebidas', 'Gaseosas, jugos, aguas'),
    ('Limpieza', 'Detergentes, desinfectantes'),
    ('Frutas y Verduras', 'Productos frescos'),
    ('Panadería', 'Pan, pasteles, galletas'),
    ('Carnicería', 'Carnes y embutidos'),
    ('Farmacia', 'Medicamentos de venta libre');

-- Insertar un usuario administrador de ejemplo
-- IMPORTANTE: Reemplazar '00000000-0000-0000-0000-000000000000' con un auth_user_id real de la tabla auth.users
-- O crear un usuario sin vincular a auth aún. Para pruebas iniciales, podemos dejar auth_user_id NULL.
INSERT INTO usuarios (auth_user_id, nombre_usuario, nombre_completo, email, rol, activo)
VALUES (NULL, 'admin', 'Administrador del Sistema', 'admin@minimarket.com', 'admin', true);

-- Insertar un cliente genérico "Consumidor Final"
INSERT INTO clientes (tipo_documento, numero_documento, nombres, apellidos, razon_social, telefono, email, direccion)
VALUES (NULL, 'CONSUMIDOR', 'Consumidor', 'Final', NULL, NULL, NULL, NULL);

-- Insertar algunos productos de ejemplo (requiere categorías existentes)
DO $$
DECLARE
    cat_abarrotes UUID;
    cat_bebidas UUID;
BEGIN
    SELECT id INTO cat_abarrotes FROM categorias WHERE nombre = 'Abarrotes' LIMIT 1;
    SELECT id INTO cat_bebidas FROM categorias WHERE nombre = 'Bebidas' LIMIT 1;
    
    INSERT INTO productos (codigo_barras, nombre, categoria_id, precio_compra, precio_venta, stock_actual, stock_minimo, unidad_medida)
    VALUES 
        ('789123456001', 'Arroz Blanco 1kg', cat_abarrotes, 1.50, 2.00, 100, 20, 'unidad'),
        ('789123456002', 'Azúcar 1kg', cat_abarrotes, 0.90, 1.20, 80, 15, 'unidad'),
        ('789123456003', 'Coca-Cola 2.5L', cat_bebidas, 2.10, 2.80, 50, 10, 'unidad');
END $$;

-- ======================================================
-- 8. NOTAS FINALES Y RECOMENDACIONES
-- ======================================================
-- 1. Para usar la autenticación de Supabase, vincular auth.users con la tabla usuarios 
--    mediante el campo auth_user_id. Las políticas RLS usan auth.uid() para comparar.
-- 2. Las inyecciones SQL se previenen usando consultas parametrizadas desde la aplicación 
--    (por ej. con supabase-js o cliente PostgreSQL). Este esquema no concatena nunca cadenas.
-- 3. Escalabilidad: Los índices cubren las consultas más comunes. Para volúmenes mayores,
--    se puede particionar ventas y movimientos por fecha.
-- 4. La auditoría de stock evita inconsistencias: cada venta o compra actualiza stock 
--    y registra el movimiento.
-- 5. Antes de ejecutar en producción, ajustar las políticas RLS según la jerarquía real 
--    de roles y permisos.
-- ======================================================