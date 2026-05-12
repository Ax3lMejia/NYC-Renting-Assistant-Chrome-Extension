create table bookmarks (                                                                                                                       
    id            uuid primary key default gen_random_uuid(),                                                                                    
    user_id       uuid references auth.users(id) on delete cascade not null,                                                                     
    address       text not null,
    listing_url   text not null,                                                                                                                 
    building_data jsonb,                                                                                                                       
    notes         text,
    listed_price  integer,
    created_at    timestamptz default now()
  );

  alter table bookmarks enable row level security;

  create policy "Users own their bookmarks"
    on bookmarks for all
    using (auth.uid() = user_id);