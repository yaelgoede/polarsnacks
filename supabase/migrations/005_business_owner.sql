-- Add owner_id to listings so business owners can manage their own listings
ALTER TABLE public.listings ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add 'draft' status for newly created listings (before payment)
ALTER TABLE public.listings DROP CONSTRAINT listings_payment_status_check;
ALTER TABLE public.listings ADD CONSTRAINT listings_payment_status_check
  CHECK (payment_status IN ('draft', 'pending', 'requested', 'paid', 'expired'));

-- Change default from 'pending' to 'draft'
ALTER TABLE public.listings ALTER COLUMN payment_status SET DEFAULT 'draft';

-- Make amount_cents nullable (server sets price at payment time)
ALTER TABLE public.listings ALTER COLUMN amount_cents DROP NOT NULL;

-- Index for owner dashboard queries
CREATE INDEX idx_listings_owner_id ON public.listings(owner_id);

-- Index for nearby listing suggestions
CREATE INDEX idx_listings_location ON public.listings(latitude, longitude)
  WHERE payment_status = 'paid' AND is_featured = TRUE;

-- RLS: Owners can manage their own listings
CREATE POLICY "Owners can view own listings" ON public.listings
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = owner_id);

-- Storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Owners can upload their own listing photos
CREATE POLICY "Owners upload listing photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Anyone authenticated can view listing photos (featured listings are public)
CREATE POLICY "Anyone can view listing photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-photos');

-- Owners can delete their own listing photos
CREATE POLICY "Owners delete listing photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
