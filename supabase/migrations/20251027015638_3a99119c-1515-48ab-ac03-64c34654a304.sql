-- Crear tipo de rol primero
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Crear tabla de roles de usuario
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver roles"
ON public.user_roles FOR SELECT
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- Función para verificar roles (SECURITY DEFINER para evitar recursión)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Crear tabla de candidatos
CREATE TABLE public.candidates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  party text NOT NULL,
  photo_url text,
  proposals text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS en candidatos (lectura pública)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver candidatos"
ON public.candidates FOR SELECT
USING (true);

CREATE POLICY "Solo admins pueden insertar candidatos"
ON public.candidates FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Solo admins pueden actualizar candidatos"
ON public.candidates FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Crear tabla de votos
CREATE TABLE public.votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  voter_name text NOT NULL,
  voter_email text NOT NULL,
  voter_location text,
  voted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS en votos
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede insertar votos"
ON public.votes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Solo admins pueden ver votos"
ON public.votes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Insertar candidatos de ejemplo
INSERT INTO public.candidates (name, party, proposals) VALUES
('María González', 'Partido Progresista', 'Educación gratuita, salud pública universal, energías renovables'),
('Juan Pérez', 'Partido Conservador', 'Seguridad ciudadana, economía de mercado, valores tradicionales'),
('Ana Rodríguez', 'Partido Verde', 'Medio ambiente, sostenibilidad, transporte público'),
('Carlos Martínez', 'Partido Liberal', 'Libertad económica, reducción de impuestos, emprendimiento');

-- Habilitar realtime para votos (para actualización en tiempo real del dashboard)
ALTER TABLE public.votes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;