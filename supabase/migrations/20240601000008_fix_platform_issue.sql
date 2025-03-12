-- Vérifier si la plateforme existe déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.platforms WHERE id = 'f60174cc-44a5-40c4-95c6-14ceb496114b') THEN
        -- Ajouter la plateforme manquante
        INSERT INTO public.platforms (id, name, description, creator_id, subdomain, logo_url, primary_color, secondary_color, status, created_at)
        VALUES (
            'f60174cc-44a5-40c4-95c6-14ceb496114b',
            'qsfqsfsq',
            'Plateforme de démonstration',
            (SELECT id FROM public.profiles LIMIT 1),
            'qsfqsfsq',
            NULL,
            '#3b82f6',
            '#10b981',
            'active',
            NOW()
        );

        -- Ajouter les niveaux d'abonnement par défaut
        INSERT INTO public.subscription_tiers (platform_id, name, price, description, benefits, is_popular, is_public)
        VALUES
        ('f60174cc-44a5-40c4-95c6-14ceb496114b', 'Free', 0, 'Basic access to content', '["Access to free content", "Community forum access"]', false, true);

        INSERT INTO public.subscription_tiers (platform_id, name, price, description, benefits, is_popular, is_public)
        VALUES
        ('f60174cc-44a5-40c4-95c6-14ceb496114b', 'Basic', 9.99, 'Standard membership with additional benefits', '["Access to all free content", "Basic exclusive content", "Community forum access", "Monthly newsletter"]', false, true);

        INSERT INTO public.subscription_tiers (platform_id, name, price, description, benefits, is_popular, is_public)
        VALUES
        ('f60174cc-44a5-40c4-95c6-14ceb496114b', 'Premium', 19.99, 'Full access to all content and premium features', '["Access to all content", "Premium exclusive content", "Direct messaging with creator", "Monthly live sessions", "Priority support"]', true, true);
    END IF;
END
$$;