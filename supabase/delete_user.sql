-- Allows authenticated users to delete their own account from the client side.
-- SECURITY DEFINER runs with the privileges of the function owner (postgres),
-- so it can delete from auth.users which RLS normally blocks.
create or replace function delete_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

-- Only authenticated users can call this function
revoke all on function delete_user() from public;
grant execute on function delete_user() to authenticated;
