-- Create table to store site configuration
create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  config_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Since this is a single-site configuration, we'll use a single row
-- Insert default configuration if it doesn't exist
insert into public.site_config (config_data) 
select '{}'::jsonb
where not exists (select 1 from public.site_config);

-- Enable RLS (Row Level Security)
alter table public.site_config enable row level security;

-- Create policies to allow public read/write access for site configuration
-- Since this is a public website configuration, we allow public access
create policy "Allow public read access to site config" 
  on public.site_config for select 
  using (true);

create policy "Allow public write access to site config" 
  on public.site_config for update 
  using (true);

create policy "Allow public insert access to site config" 
  on public.site_config for insert 
  with check (true);
