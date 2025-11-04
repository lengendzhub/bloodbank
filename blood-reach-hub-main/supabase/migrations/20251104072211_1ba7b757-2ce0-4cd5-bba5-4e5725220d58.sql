-- Create enum for blood groups
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Create enum for availability status
CREATE TYPE availability_status AS ENUM ('available', 'unavailable', 'emergency_only');

-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  blood_group blood_group NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  location_city TEXT NOT NULL,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  availability availability_status NOT NULL DEFAULT 'available',
  last_donation_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Create policies for donors table
CREATE POLICY "Anyone can view donors"
  ON public.donors
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert donors"
  ON public.donors
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donors"
  ON public.donors
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own donors"
  ON public.donors
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient blood group filtering
CREATE INDEX idx_donors_blood_group ON public.donors(blood_group);

-- Create index for location-based queries
CREATE INDEX idx_donors_location ON public.donors(location_city);

-- Create index for availability status
CREATE INDEX idx_donors_availability ON public.donors(availability);