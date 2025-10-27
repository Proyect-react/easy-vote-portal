-- Crear usuario administrador de prueba
-- Email: admin@electoral.gov
-- Password: Admin2025!

-- Insertar usuario en auth.users (usando la función de Supabase)
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Generar un UUID para el usuario
  new_user_id := gen_random_uuid();
  
  -- Insertar en auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@electoral.gov',
    crypt('Admin2025!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated',
    'authenticated'
  );
  
  -- Asignar rol de admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');
  
  RAISE NOTICE 'Usuario administrador creado: admin@electoral.gov / Admin2025!';
END $$;