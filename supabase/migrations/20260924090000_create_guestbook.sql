-- Task 007: sổ lưu bút (product.md mục Sổ lưu bút, data-layer.md).

create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

comment on table public.guestbook_entries is 'Lời chúc. Không có policy cho anon: đọc qua list_guestbook, ghi qua add_guestbook_entry.';

create index guestbook_entries_created_at_idx on public.guestbook_entries (created_at desc);
create index guestbook_entries_guest_id_idx on public.guestbook_entries (guest_id);

alter table public.guestbook_entries enable row level security;

-- 50 lời chúc mới nhất, chỉ trả tên hiển thị, nội dung, thời gian (không lộ mã khách).
-- Chấp nhận có chủ đích cảnh báo lint 0028/0029: danh sách công khai theo product.md.
create or replace function public.list_guestbook()
returns table (author_name text, message text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select g.display_name, e.message, e.created_at
  from public.guestbook_entries e
  join public.guests g on g.id = e.guest_id
  order by e.created_at desc
  limit 50;
$$;

revoke execute on function public.list_guestbook() from public, anon, authenticated;
grant execute on function public.list_guestbook() to anon, authenticated;

-- Thêm lời chúc; tên tác giả lấy từ guests nên khách không giả mạo được người khác.
create or replace function public.add_guestbook_entry(p_code text, p_message text)
returns json
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
  v_message text := btrim(p_message);
  v_count int;
  v_row public.guestbook_entries%rowtype;
begin
  if p_code is null or char_length(p_code) <> 16 then
    raise exception 'invalid_code';
  end if;

  select * into v_guest from public.guests where code = p_code;
  if not found then
    raise exception 'invalid_code';
  end if;

  if v_message is null or char_length(v_message) not between 1 and 500 then
    raise exception 'invalid_input';
  end if;

  -- Khóa hàng khách để hai lượt gửi đồng thời không cùng vượt giới hạn 3.
  perform 1 from public.guests where id = v_guest.id for update;
  select count(*) into v_count from public.guestbook_entries where guest_id = v_guest.id;
  if v_count >= 3 then
    raise exception 'limit_reached';
  end if;

  insert into public.guestbook_entries (guest_id, message)
  values (v_guest.id, v_message)
  returning * into v_row;

  return json_build_object(
    'author_name', v_guest.display_name,
    'message', v_row.message,
    'created_at', v_row.created_at
  );
end;
$$;

revoke execute on function public.add_guestbook_entry(text, text) from public, anon, authenticated;
grant execute on function public.add_guestbook_entry(text, text) to anon, authenticated;

-- Admin xem và xóa lời chúc.
create policy "guestbook_admin_select" on public.guestbook_entries
  for select to authenticated using ((select public.is_admin()));
create policy "guestbook_admin_delete" on public.guestbook_entries
  for delete to authenticated using ((select public.is_admin()));

-- get_invitation trả thêm số lời chúc khách đã gửi để form biết còn gửi được không.
create or replace function public.get_invitation(p_code text)
returns json
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
  v_rsvp public.rsvps%rowtype;
begin
  if p_code is null or char_length(p_code) <> 16 then
    raise exception 'invalid_code';
  end if;

  select * into v_guest from public.guests where code = p_code;
  if not found then
    raise exception 'invalid_code';
  end if;

  select * into v_rsvp from public.rsvps where guest_id = v_guest.id;

  return json_build_object(
    'display_name', v_guest.display_name,
    'rsvp', case when v_rsvp.guest_id is null then null else json_build_object(
      'attending', v_rsvp.attending,
      'party_size', v_rsvp.party_size,
      'message', v_rsvp.message
    ) end,
    'guestbook_count', (select count(*) from public.guestbook_entries where guest_id = v_guest.id)
  );
end;
$$;
