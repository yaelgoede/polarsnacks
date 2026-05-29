-- Create storage buckets (skip if already exist)
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-photos', 'meal-photos', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-covers', 'trip-covers', false) ON CONFLICT (id) DO NOTHING;

-- Storage policies for meal-photos (private bucket)
CREATE POLICY "Users upload own meal photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own meal photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own meal photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for trip-covers (private bucket)
CREATE POLICY "Users upload own trip covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own trip covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own trip covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
