-- Execute no SQL Editor para habilitar o formulário /contact.
begin;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  subject text not null check (subject in (
    'Dúvida sobre candidaturas', 'Publicação de oportunidades', 'Conta e acesso',
    'Relatar um problema', 'Sugestão ou parceria', 'Outro assunto'
  )),
  message text not null check (char_length(trim(message)) between 20 and 5000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
grant insert (name, email, subject, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;

drop policy if exists "visitors send contact messages" on public.contact_messages;
create policy "visitors send contact messages" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "admins read contact messages" on public.contact_messages;
create policy "admins read contact messages" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "admins delete contact messages" on public.contact_messages;
create policy "admins delete contact messages" on public.contact_messages
  for delete to authenticated using (public.is_admin());

commit;

-- Mensagens podem ser consultadas na tabela contact_messages pelo SQL Editor.
-- Este formulário registra mensagens; não envia e-mails automaticamente.
