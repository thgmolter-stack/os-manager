-- Creating site_config table for storing website configuration
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is for site configuration)
CREATE POLICY "Allow all operations on site_config" ON public.site_config
FOR ALL USING (true);

-- Insert default configuration if it doesn't exist
INSERT INTO public.site_config (id, data) 
VALUES ('default', '{}')
ON CONFLICT (id) DO NOTHING;
