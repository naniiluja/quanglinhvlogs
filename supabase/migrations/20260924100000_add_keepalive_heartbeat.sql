-- Task 009: chống Supabase Free tự tạm dừng sau 7 ngày không hoạt động.
-- Theo mẫu của dự án tinhtiendien: Supabase tính hoạt động theo request thật qua Data API,
-- pg_cron chạy trong DB không tính. Một routine Claude Code hằng ngày gọi RPC bên dưới.

create table if not exists public.system_heartbeat (
  id int primary key default 1,
  pinged_at timestamptz not null default now(),
  constraint system_heartbeat_singleton check (id = 1)
);

-- RLS bật, không có policy: không ai đọc hoặc ghi trực tiếp, chỉ qua RPC.
alter table public.system_heartbeat enable row level security;

insert into public.system_heartbeat (id) values (1) on conflict (id) do nothing;

-- Chỉ cập nhật mốc thời gian, không chạm dữ liệu nghiệp vụ.
-- Chấp nhận có chủ đích cảnh báo lint 0028/0029: routine gọi bằng publishable key.
create or replace function public.keepalive_ping()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.system_heartbeat set pinged_at = now() where id = 1;
$$;

revoke execute on function public.keepalive_ping() from public, anon, authenticated;
grant execute on function public.keepalive_ping() to anon, authenticated;
