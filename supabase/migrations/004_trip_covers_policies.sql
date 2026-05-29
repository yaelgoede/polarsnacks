-- Storage policies for trip-covers bucket
CREATE POLICY "Users upload own trip covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own trip covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own trip covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);
