-- Task 002: khách mời và hàm lấy lời mời theo mã (security.md, data-layer.md).

-- Mặc định đóng: hàm mới tạo trong public không tự cấp quyền gọi cho ai.
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Mã khách: 12 byte ngẫu nhiên từ pgcrypto, base64 an toàn cho URL, ra 16 ký tự.
create or replace function public.generate_guest_code()
returns text
language sql
volatile
set search_path = ''
as $$
  select translate(encode(extensions.gen_random_bytes(12), 'base64'), '+/', '-_');
$$;

revoke execute on function public.generate_guest_code() from public, anon, authenticated;

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.generate_guest_code(),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  created_at timestamptz not null default now()
);

comment on table public.guests is 'Khách mời. Không có policy cho anon: khách chỉ đọc qua get_invitation.';

-- RLS bật, không có policy nào: anon và authenticated đều không đọc trực tiếp được.
alter table public.guests enable row level security;

-- Lời mời theo mã. Mã sai và mã không tồn tại trả cùng một lỗi invalid_code.
-- Chấp nhận có chủ đích cảnh báo lint 0028 (anon gọi được hàm security definer):
-- đây là endpoint công khai duy nhất để khách đọc tên của mình, tự kiểm tra đầu vào.
create or replace function public.get_invitation(p_code text)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
begin
  if p_code is null or char_length(p_code) <> 16 then
    raise exception 'invalid_code';
  end if;

  select * into v_guest from public.guests where code = p_code;

  if not found then
    raise exception 'invalid_code';
  end if;

  return json_build_object('display_name', v_guest.display_name);
end;
$$;

revoke execute on function public.get_invitation(text) from public, anon, authenticated;
grant execute on function public.get_invitation(text) to anon, authenticated;
