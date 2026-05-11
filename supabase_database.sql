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

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categorias_updated_at
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_proveedores_updated_at
BEFORE UPDATE ON proveedores
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_productos_updated_at
BEFORE UPDATE ON productos
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_ventas_updated_at
BEFORE UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_compras_updated_at
BEFORE UPDATE ON compras
FOR EACH ROW
EXECUTE FUNCTION actualizar_updated_at();

CREATE OR REPLACE FUNCTION procesar_detalle_venta()
RETURNS TRIGGER AS $$
BEGIN

    -- Validar stock suficiente
    IF (
        SELECT stock_actual
        FROM productos
        WHERE id = NEW.producto_id
    ) < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente';
    END IF;

    -- Descontar stock
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id = NEW.producto_id;

    -- Registrar movimiento
    INSERT INTO movimientos_stock (
        producto_id,
        tipo_movimiento,
        cantidad,
        referencia_tipo,
        referencia_id,
        stock_previo,
        stock_nuevo
    )
    VALUES (
        NEW.producto_id,
        'salida',
        NEW.cantidad,
        'venta',
        NEW.venta_id,
        (
            SELECT stock_actual + NEW.cantidad
            FROM productos
            WHERE id = NEW.producto_id
        ),
        (
            SELECT stock_actual
            FROM productos
            WHERE id = NEW.producto_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detalle_venta_stock
AFTER INSERT ON detalles_venta
FOR EACH ROW
EXECUTE FUNCTION procesar_detalle_venta();

CREATE OR REPLACE FUNCTION procesar_detalle_compra()
RETURNS TRIGGER AS $$
BEGIN

    UPDATE productos
    SET stock_actual = stock_actual + NEW.cantidad
    WHERE id = NEW.producto_id;

    INSERT INTO movimientos_stock (
        producto_id,
        tipo_movimiento,
        cantidad,
        referencia_tipo,
        referencia_id,
        stock_previo,
        stock_nuevo
    )
    VALUES (
        NEW.producto_id,
        'entrada',
        NEW.cantidad,
        'compra',
        NEW.compra_id,
        (
            SELECT stock_actual - NEW.cantidad
            FROM productos
            WHERE id = NEW.producto_id
        ),
        (
            SELECT stock_actual
            FROM productos
            WHERE id = NEW.producto_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detalle_compra_stock
AFTER INSERT ON detalles_compra
FOR EACH ROW
EXECUTE FUNCTION procesar_detalle_compra();

CREATE OR REPLACE FUNCTION public.crear_usuario_desde_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

  INSERT INTO public.usuarios (
    auth_user_id,
    nombre_usuario,
    nombre_completo,
    email,
    rol,
    activo
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nombre_usuario',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'nombre_completo',
      NEW.email
    ),
    NEW.email,
    'cajero',
    true
  );

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creando usuario automático: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auth_usuario
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.crear_usuario_desde_auth();

1. PRINCIPIO IMPORTANTE

NO pongas policies “por tabla” sin estrategia.

Primero define:

Roles reales
admin
gerente
cajero
bodeguero
2. Helpers recomendados
Rol actual
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol
  FROM usuarios
  WHERE auth_user_id = auth.uid()
    AND activo = true
  LIMIT 1;
$$;
Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM usuarios
    WHERE auth_user_id = auth.uid()
      AND rol = 'admin'
      AND activo = true
  );
$$;
Admin o gerente
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_role()
  IN ('admin', 'gerente');
$$;
3. ACTIVAR RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE cierres_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE formas_pago ENABLE ROW LEVEL SECURITY;
4. TABLA USUARIOS
Ver su propio usuario o admin
CREATE POLICY usuarios_select
ON usuarios
FOR SELECT
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR public.is_admin()
);
Insert solo admin
CREATE POLICY usuarios_insert
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
);
Update propio perfil o admin
CREATE POLICY usuarios_update
ON usuarios
FOR UPDATE
TO authenticated
USING (
  auth_user_id = auth.uid()
  OR public.is_admin()
)
WITH CHECK (
  auth_user_id = auth.uid()
  OR public.is_admin()
);
5. PRODUCTOS
Todos autenticados pueden ver
CREATE POLICY productos_select
ON productos
FOR SELECT
TO authenticated
USING (true);
Solo admin/gerente modifica
CREATE POLICY productos_insert
ON productos
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin_or_manager()
);
CREATE POLICY productos_update
ON productos
FOR UPDATE
TO authenticated
USING (
  public.is_admin_or_manager()
)
WITH CHECK (
  public.is_admin_or_manager()
);
CREATE POLICY productos_delete
ON productos
FOR DELETE
TO authenticated
USING (
  public.is_admin()
);
6. CATEGORÍAS
Lectura
CREATE POLICY categorias_select
ON categorias
FOR SELECT
TO authenticated
USING (true);
Modificación
CREATE POLICY categorias_all
ON categorias
FOR ALL
TO authenticated
USING (
  public.is_admin_or_manager()
)
WITH CHECK (
  public.is_admin_or_manager()
);
7. CLIENTES
Todos autenticados leen
CREATE POLICY clientes_select
ON clientes
FOR SELECT
TO authenticated
USING (true);
Cajero/admin insertan
CREATE POLICY clientes_insert
ON clientes
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'cajero')
);
Update
CREATE POLICY clientes_update
ON clientes
FOR UPDATE
TO authenticated
USING (
  public.current_user_role()
  IN ('admin', 'gerente', 'cajero')
)
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'cajero')
);
8. VENTAS
Ver ventas
CREATE POLICY ventas_select
ON ventas
FOR SELECT
TO authenticated
USING (true);
Insert ventas
CREATE POLICY ventas_insert
ON ventas
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'cajero')
);
Update ventas

Idealmente solo:

admin
gerente
CREATE POLICY ventas_update
ON ventas
FOR UPDATE
TO authenticated
USING (
  public.current_user_role()
  IN ('admin', 'gerente')
)
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente')
);
9. DETALLES_VENTA
Lectura
CREATE POLICY detalles_venta_select
ON detalles_venta
FOR SELECT
TO authenticated
USING (true);
Insert
CREATE POLICY detalles_venta_insert
ON detalles_venta
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'cajero')
);
10. COMPRAS
Lectura
CREATE POLICY compras_select
ON compras
FOR SELECT
TO authenticated
USING (true);
Insert compras
CREATE POLICY compras_insert
ON compras
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'bodeguero')
);
11. DETALLES_COMPRA
CREATE POLICY detalles_compra_select
ON detalles_compra
FOR SELECT
TO authenticated
USING (true);
CREATE POLICY detalles_compra_insert
ON detalles_compra
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_role()
  IN ('admin', 'gerente', 'bodeguero')
);
12. MOVIMIENTOS STOCK

MUY IMPORTANTE:
nadie debería modificar esto manualmente.

Solo lectura
CREATE POLICY movimientos_stock_select
ON movimientos_stock
FOR SELECT
TO authenticated
USING (true);
NO crear policies INSERT/UPDATE/DELETE

Así:

solo triggers
o service role
pueden modificar.

Perfecto para auditoría.

13. FORMAS PAGO
Lectura
CREATE POLICY formas_pago_select
ON formas_pago
FOR SELECT
TO authenticated
USING (true);
Modificación admin
CREATE POLICY formas_pago_all
ON formas_pago
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);
14. CIERRES DE CAJA
Ver propios cierres o admin
CREATE POLICY cierres_select
ON cierres_caja
FOR SELECT
TO authenticated
USING (
  usuario_id IN (
    SELECT id
    FROM usuarios
    WHERE auth_user_id = auth.uid()
  )
  OR public.is_admin()
);
15. MUY IMPORTANTE

Si usarás:

triggers
RPC
funciones automáticas

usa:

SECURITY DEFINER

en funciones críticas.

Porque RLS también afecta funciones.

16. Recomendación profesional REAL

NO hagas inserts complejos desde frontend.

Haz:

SELECT crear_venta(...)

y que PostgreSQL:

inserte venta
inserte detalles
descuente stock
genere auditoría
valide permisos

TODO en backend.

Eso es muchísimo más seguro.