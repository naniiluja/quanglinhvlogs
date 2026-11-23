-- Bên mời của khách, đăng ký xe và lưu trú (chủ dự án yêu cầu 2026-11-23).
-- Xe và lưu trú là hai quyền riêng: admin tick cho khách nào thì khách đó mới thấy và đăng ký được.

alter table public.guests
  add column side text not null default 'both' check (side in ('groom', 'bride', 'both')),
  add column can_register_transport boolean not null default false,
  add column can_register_lodging boolean not null default false;

comment on column public.guests.side is 'Khách của nhà trai, nhà gái hay cả hai: quyết định buổi lễ hiện trên thiệp.';

-- Mỗi khách tối đa một bản đăng ký cho mỗi loại; gửi lại thì ghi đè (giống RSVP).
create table public.logistics_registrations (
  guest_id uuid not null references public.guests (id) on delete cascade,
  kind text not null check (kind in ('transport', 'lodging')),
  needed boolean not null,
  party_size smallint not null check (party_size between 1 and 10),
  phone text check (phone is null or phone ~ '^\+?[0-9 .]{8,20}$'),
  nights date[] check (nights is null or cardinality(nights) between 1 and 5),
  note text check (note is null or char_length(note) between 1 and 300),
  updated_at timestamptz not null default now(),
  primary key (guest_id, kind),
  check (not needed or phone is not null)
);

comment on table public.logistics_registrations is 'Đăng ký xe, lưu trú. Không có policy cho anon: ghi qua submit_logistics.';

alter table public.logistics_registrations enable row level security;

-- Lịch trình xe và thông tin lưu trú do admin nhập. Số điện thoại người liên hệ nằm trong DB,
-- không nằm trong repo công khai; khách chỉ đọc qua get_logistics khi được tick đúng loại.
create table public.logistics_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('transport', 'lodging')),
  side text not null default 'both' check (side in ('groom', 'bride', 'both')),
  starts_at timestamptz,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  location text check (location is null or char_length(location) <= 500),
  contact_name text check (contact_name is null or char_length(contact_name) <= 80),
  contact_phone text check (contact_phone is null or char_length(contact_phone) <= 20),
  note text check (note is null or char_length(note) <= 300),
  created_at timestamptz not null default now()
);

comment on table public.logistics_items is 'Lịch trình xe, nơi lưu trú. Khách đọc qua get_logistics.';

create index logistics_items_kind_starts_at_idx on public.logistics_items (kind, starts_at);

alter table public.logistics_items enable row level security;

create policy "logistics_items_admin_select" on public.logistics_items
  for select to authenticated using ((select public.is_admin()));
create policy "logistics_items_admin_insert" on public.logistics_items
  for insert to authenticated with check ((select public.is_admin()));
create policy "logistics_items_admin_update" on public.logistics_items
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "logistics_items_admin_delete" on public.logistics_items
  for delete to authenticated using ((select public.is_admin()));

create policy "logistics_registrations_admin_select" on public.logistics_registrations
  for select to authenticated using ((select public.is_admin()));

-- get_invitation trả thêm bên mời và hai quyền đăng ký.
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
    'side', v_guest.side,
    'can_register_transport', v_guest.can_register_transport,
    'can_register_lodging', v_guest.can_register_lodging,
    'rsvp', case when v_rsvp.guest_id is null then null else json_build_object(
      'attending', v_rsvp.attending,
      'party_size', v_rsvp.party_size,
      'message', v_rsvp.message
    ) end,
    'guestbook_count', (select count(*) from public.guestbook_entries where guest_id = v_guest.id)
  );
end;
$$;

-- Một loại (xe hoặc lưu trú) của một khách: null nếu khách không được tick loại đó.
-- Hàm nội bộ, không cấp quyền gọi cho ai; get_logistics (security definer) gọi nó.
create or replace function public.logistics_for_guest(p_guest public.guests, p_kind text)
returns json
language sql
stable
set search_path = ''
as $$
  select case
    when (p_kind = 'transport' and not p_guest.can_register_transport)
      or (p_kind = 'lodging' and not p_guest.can_register_lodging) then null
    else json_build_object(
      'registration', (
        select json_build_object(
          'needed', r.needed,
          'party_size', r.party_size,
          'phone', r.phone,
          'nights', r.nights,
          'note', r.note
        )
        from public.logistics_registrations r
        where r.guest_id = p_guest.id and r.kind = p_kind
      ),
      'items', coalesce((
        select json_agg(json_build_object(
          'id', i.id,
          'starts_at', i.starts_at,
          'title', i.title,
          'location', i.location,
          'contact_name', i.contact_name,
          'contact_phone', i.contact_phone,
          'note', i.note
        ) order by i.starts_at nulls last, i.created_at)
        from public.logistics_items i
        where i.kind = p_kind
          -- Khách cả hai bên thấy mọi mục; khách một bên thấy mục của bên mình và mục chung.
          and (p_guest.side = 'both' or i.side = 'both' or i.side = p_guest.side)
      ), '[]'::json)
    )
  end;
$$;

revoke execute on function public.logistics_for_guest(public.guests, text) from public, anon, authenticated;

-- Chấp nhận có chủ đích cảnh báo lint 0028/0029 như get_invitation: endpoint công khai, tự kiểm tra mã.
create or replace function public.get_logistics(p_code text)
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

  return json_build_object(
    'transport', public.logistics_for_guest(v_guest, 'transport'),
    'lodging', public.logistics_for_guest(v_guest, 'lodging')
  );
end;
$$;

revoke execute on function public.get_logistics(text) from public, anon, authenticated;
grant execute on function public.get_logistics(text) to anon, authenticated;

-- Ghi đè đăng ký của khách cho một loại. Khách không được tick loại đó thì từ chối.
create or replace function public.submit_logistics(
  p_code text,
  p_kind text,
  p_needed boolean,
  p_party_size smallint,
  p_phone text,
  p_nights date[],
  p_note text
)
returns json
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_guest public.guests%rowtype;
  v_phone text := nullif(btrim(p_phone), '');
  v_note text := nullif(btrim(p_note), '');
  v_nights date[] := case when p_kind = 'lodging' and p_needed then p_nights else null end;
  v_row public.logistics_registrations%rowtype;
begin
  if p_code is null or char_length(p_code) <> 16 then
    raise exception 'invalid_code';
  end if;

  select * into v_guest from public.guests where code = p_code;
  if not found then
    raise exception 'invalid_code';
  end if;

  if p_kind is null
    or p_kind not in ('transport', 'lodging')
    or (p_kind = 'transport' and not v_guest.can_register_transport)
    or (p_kind = 'lodging' and not v_guest.can_register_lodging)
    or p_needed is null
    or p_party_size is null
    or p_party_size not between 1 and 10
    or (v_phone is not null and v_phone !~ '^\+?[0-9 .]{8,20}$')
    or (p_needed and v_phone is null)
    or (v_note is not null and char_length(v_note) > 300)
    or (v_nights is null and p_kind = 'lodging' and p_needed)
    or (v_nights is not null and (
      cardinality(v_nights) not between 1 and 5
      or exists (select 1 from unnest(v_nights) d where d not between date '2026-12-01' and date '2026-12-31')
    )) then
    raise exception 'invalid_input';
  end if;

  insert into public.logistics_registrations as r
    (guest_id, kind, needed, party_size, phone, nights, note, updated_at)
  values (v_guest.id, p_kind, p_needed, p_party_size, v_phone, v_nights, v_note, now())
  on conflict (guest_id, kind) do update
    set needed = excluded.needed,
        party_size = excluded.party_size,
        phone = excluded.phone,
        nights = excluded.nights,
        note = excluded.note,
        updated_at = excluded.updated_at
  returning * into v_row;

  return json_build_object(
    'needed', v_row.needed,
    'party_size', v_row.party_size,
    'phone', v_row.phone,
    'nights', v_row.nights,
    'note', v_row.note
  );
end;
$$;

revoke execute on function public.submit_logistics(text, text, boolean, smallint, text, date[], text) from public, anon, authenticated;
grant execute on function public.submit_logistics(text, text, boolean, smallint, text, date[], text) to anon, authenticated;
