-- Feedback table for collecting user bug reports, ideas, and satisfaction scores
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('bug', 'idea', 'other', 'satisfaction')),
  message text,
  rating smallint check (rating between 1 and 5),
  page_path text,
  context jsonb default '{}',
  screenshot_path text,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

create policy "Users can insert own feedback"
  on public.feedback for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own feedback"
  on public.feedback for select to authenticated
  using (auth.uid() = user_id);

-- Storage bucket for optional feedback screenshots
insert into storage.buckets (id, name, public)
values ('feedback-screenshots', 'feedback-screenshots', false);

create policy "Users can upload feedback screenshots"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'feedback-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can read own feedback screenshots"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'feedback-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
