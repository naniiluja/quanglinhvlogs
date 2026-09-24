-- Task 003: xác nhận tham dự (product.md mục RSVP, data-layer.md).

create table public.rsvps (
  guest_id uuid primary key references public.guests (id) on delete cascade,
  attending boolean not null,
  party_size smallint not null check (party_size between 1 and 5),
  message text check (message is null or char_length(message) between 1 and 500),
  updated_at timestamptz not null default now()
);

comment on table public.rsvps is 'Mỗi khách đúng một hàng (khóa chính guest_id). Không có policy cho anon: ghi qua submit_rsvp.';

alter table public.rsvps enable row level security;

-- Ghi đè câu trả lời của khách. Tự kiểm tra đầu vào vì là endpoint công khai.
-- Chấp nhận có chủ đích cảnh báo lint 0028/0029 như get_invitation.
create or replace function public.submit_rsvp(
  p_code text,
  p_attending boolean,
  p_party_size smallint,
  p_message text
)
returns json
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_guest_id uuid;
  v_message text := nullif(btrim(p_message), '');
  v_row public.rsvps%rowtype;
begin
  if p_code is null or char_length(p_code) <> 16 then
    raise exception 'invalid_code';
  end if;

  select id into v_guest_id from public.guests where code = p_code;
  if not found then
    raise exception 'invalid_code';
  end if;

  if p_attending is null
    or p_party_size is null
    or p_party_size not between 1 and 5
    or (v_message is not null and char_length(v_message) > 500) then
    raise exception 'invalid_input';
  end if;

  insert into public.rsvps as r (guest_id, attending, party_size, message, updated_at)
  values (v_guest_id, p_attending, p_party_size, v_message, now())
  on conflict (guest_id) do update
    set attending = excluded.attending,
        party_size = excluded.party_size,
        message = excluded.message,
        updated_at = excluded.updated_at
  returning * into v_row;

  return json_build_object(
    'attending', v_row.attending,
    'party_size', v_row.party_size,
    'message', v_row.message
  );
end;
$$;

revoke execute on function public.submit_rsvp(text, boolean, smallint, text) from public, anon, authenticated;
grant execute on function public.submit_rsvp(text, boolean, smallint, text) to anon, authenticated;

-- get_invitation trả thêm câu trả lời đã gửi (hoặc null) để form hiện sẵn.
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
    ) end
  );
end;
$$;
