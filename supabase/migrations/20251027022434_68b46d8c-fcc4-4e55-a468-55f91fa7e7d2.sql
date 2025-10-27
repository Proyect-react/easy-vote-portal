-- Eliminar la política recursiva actual
DROP POLICY IF EXISTS "Solo admins pueden ver roles" ON public.user_roles;

-- Crear nueva política usando la función has_role (security definer)
CREATE POLICY "Solo admins pueden ver roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));