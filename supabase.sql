-- Cole tudo isto em Supabase > SQL Editor > Run
create table produtos(id text primary key,nome text not null,preco numeric not null,custo numeric default 0,cat text not null,descr text default '',img text,ativo boolean default true,combo boolean default false,ordem int default 0,dados jsonb default '{}');
create table pedidos(id bigint generated always as identity primary key,criado timestamptz default now(),tipo text,mesa int,cliente text,pagamento text,total numeric,custo numeric default 0,itens jsonb,status text default 'novo');
create table despesas(id bigint generated always as identity primary key,data date default current_date,descricao text,valor numeric);
alter table produtos enable row level security;
alter table pedidos enable row level security;
alter table despesas enable row level security;
create policy "ver produtos" on produtos for select using(true);
create policy "adm produtos" on produtos for all to authenticated using(true) with check(true);
create policy "novo pedido" on pedidos for insert to anon,authenticated with check(true);
create policy "adm pedidos" on pedidos for all to authenticated using(true) with check(true);
create policy "adm despesas" on despesas for all to authenticated using(true) with check(true);
insert into storage.buckets(id,name,public) values('fotos','fotos',true) on conflict do nothing;
create policy "ver fotos" on storage.objects for select using(bucket_id='fotos');
create policy "adm fotos" on storage.objects for all to authenticated using(bucket_id='fotos') with check(bucket_id='fotos');
