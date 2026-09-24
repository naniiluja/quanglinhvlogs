-- Task 006: admin theo allowlist (security.md mục Admin, data-layer.md).

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Allowlist admin. Thêm hàng bằng SQL sau khi chủ dự án tạo tài khoản trong dashboard.';

alter table public.admins enable row level security;

-- security definer để đọc admins mà không vướng RLS của chính bảng này.
-- Chấp nhận có chủ đích cảnh báo lint 0029 (authenticated gọi được): hàm chỉ trả true/false cho chính người gọi.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- Người đăng nhập chỉ thấy hàng của chính mình (để client biết mình có phải admin không).
create policy "admins_select_self" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Admin quản lý khách. Không dừng ở "to authenticated": luôn kiểm tra allowlist.
create policy "guests_admin_select" on public.guests
  for select to authenticated using ((select public.is_admin()));
create policy "guests_admin_insert" on public.guests
  for insert to authenticated with check ((select public.is_admin()));
create policy "guests_admin_update" on public.guests
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "guests_admin_delete" on public.guests
  for delete to authenticated using ((select public.is_admin()));

-- Admin xem câu trả lời; xóa khách thì RSVP tự xóa theo (on delete cascade).
create policy "rsvps_admin_select" on public.rsvps
  for select to authenticated using ((select public.is_admin()));

-- Giá trị mặc định của guests.code chạy bằng quyền người chèn hàng, nên admin cần quyền gọi hàm sinh mã.
grant execute on function public.generate_guest_code() to authenticated;
