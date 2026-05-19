-- QualifyChat — Knowledge base + RAG (pgvector)
-- Run in Supabase SQL Editor after 001_initial_schema.sql

create extension if not exists vector;

-- Storage bucket for uploaded files (private)
insert into storage.buckets (id, name, public, file_size_limit)
values ('knowledge-docs', 'knowledge-docs', false, 10485760)
on conflict (id) do nothing;

-- Documents (one row per uploaded file)
create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  file_name text not null,
  file_path text not null,
  mime_type text default '',
  file_size_bytes bigint default 0,
  extracted_text text default '',
  chunk_count int not null default 0,
  status text not null default 'processing',
  error_message text default '',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_documents_status_check check (
    status in ('processing', 'ready', 'failed')
  )
);

create index if not exists knowledge_documents_business_id_idx
  on public.knowledge_documents (business_id);

-- Chunks with embeddings for similarity search
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.knowledge_documents (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  token_estimate int default 0,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists document_chunks_business_id_idx
  on public.document_chunks (business_id);

create index if not exists document_chunks_document_id_idx
  on public.document_chunks (document_id);

-- Vector index for similarity search (run after first successful upload if this line fails on empty DB)
-- If migration errors here, comment out these 3 lines, upload one doc, then run:
--   create index document_chunks_embedding_idx on public.document_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using hnsw (embedding vector_cosine_ops);

drop trigger if exists knowledge_documents_updated_at on public.knowledge_documents;
create trigger knowledge_documents_updated_at
  before update on public.knowledge_documents
  for each row execute function public.set_updated_at();

-- Similarity search (called from server API with service role)
create or replace function public.match_document_chunks(
  p_business_id uuid,
  p_query_embedding vector(1536),
  p_match_count int default 8,
  p_match_threshold float default 0.65
)
returns table (
  id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.content,
    1 - (dc.embedding <=> p_query_embedding) as similarity
  from public.document_chunks dc
  inner join public.knowledge_documents kd on kd.id = dc.document_id
  where dc.business_id = p_business_id
    and kd.is_enabled = true
    and kd.status = 'ready'
    and dc.embedding is not null
    and 1 - (dc.embedding <=> p_query_embedding) >= p_match_threshold
  order by dc.embedding <=> p_query_embedding
  limit p_match_count;
$$;

-- RLS
alter table public.knowledge_documents enable row level security;
alter table public.document_chunks enable row level security;

create policy "knowledge_documents_select_own"
  on public.knowledge_documents for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = knowledge_documents.business_id and b.user_id = auth.uid()
    )
  );

create policy "knowledge_documents_insert_own"
  on public.knowledge_documents for insert
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = knowledge_documents.business_id and b.user_id = auth.uid()
    )
  );

create policy "knowledge_documents_update_own"
  on public.knowledge_documents for update
  using (
    exists (
      select 1 from public.businesses b
      where b.id = knowledge_documents.business_id and b.user_id = auth.uid()
    )
  );

create policy "knowledge_documents_delete_own"
  on public.knowledge_documents for delete
  using (
    exists (
      select 1 from public.businesses b
      where b.id = knowledge_documents.business_id and b.user_id = auth.uid()
    )
  );

create policy "document_chunks_select_own"
  on public.document_chunks for select
  using (
    exists (
      select 1 from public.businesses b
      where b.id = document_chunks.business_id and b.user_id = auth.uid()
    )
  );

-- Storage: owners read/write files under their business folder
create policy "knowledge_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'knowledge-docs'
    and (storage.foldername(name))[1] in (
      select b.id::text from public.businesses b where b.user_id = auth.uid()
    )
  );

create policy "knowledge_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'knowledge-docs'
    and (storage.foldername(name))[1] in (
      select b.id::text from public.businesses b where b.user_id = auth.uid()
    )
  );

create policy "knowledge_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'knowledge-docs'
    and (storage.foldername(name))[1] in (
      select b.id::text from public.businesses b where b.user_id = auth.uid()
    )
  );
