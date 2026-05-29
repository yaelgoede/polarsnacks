ALTER TABLE meals ADD COLUMN category text CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'drinks'));
