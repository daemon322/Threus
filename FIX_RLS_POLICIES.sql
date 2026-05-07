-- ======================================================
-- FIX: Actualizar RLS Policies para permitir lectura de productos
-- ======================================================
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Permitir lectura a TODOS (anónimo y autenticado) para ver productos
-- Esta política permite que cualquiera lea los productos sin necesidad de autenticación
ALTER POLICY "Allow public read" ON productos
FOR SELECT
USING (true);

-- Si la política anterior no existe, crearla:
CREATE POLICY "Allow public read" ON productos
FOR SELECT
USING (true);

-- 2. Permitir lectura de categorías a todos
DROP POLICY IF EXISTS "Allow public read" ON categorias;
CREATE POLICY "Allow public read" ON categorias
FOR SELECT
USING (true);

-- 3. Permitir lectura de formas_pago a todos
DROP POLICY IF EXISTS "Allow public read" ON formas_pago;
CREATE POLICY "Allow public read" ON formas_pago
FOR SELECT
USING (true);

-- 4. Permitir lectura de usuarios a todos (para mostrar info básica)
DROP POLICY IF EXISTS "Allow public read" ON usuarios;
CREATE POLICY "Allow public read" ON usuarios
FOR SELECT
USING (true);

-- ======================================================
-- IMPORTANTE: Solo ejecuta esto si quieres que sea COMPLETAMENTE PÚBLICO
-- Para mayor seguridad, considera usar autenticación de Supabase
-- ======================================================
