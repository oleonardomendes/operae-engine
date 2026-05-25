-- Adiciona campos de endereço de origem para cálculo de frete em cada loja.
-- Cada lojista despacha de um endereço diferente — não pode ser env var global.
--
-- NÃO EXECUTAR manualmente — use: supabase db push (ou aplique via dashboard).
-- Após executar, preencher o Tá Pra Pesca:
--   update stores set
--     shipping_from_cep     = '...',
--     shipping_from_nome    = 'Tá Pra Pesca',
--     shipping_from_rua     = '...',
--     shipping_from_numero  = '...',
--     shipping_from_bairro  = '...',
--     shipping_from_cidade  = '...',
--     shipping_from_uf      = 'SP'   -- ajustar para o estado correto
--   where store_id = 'taprapesca';

alter table stores
  add column if not exists shipping_from_cep     text,
  add column if not exists shipping_from_nome    text,
  add column if not exists shipping_from_rua     text,
  add column if not exists shipping_from_numero  text,
  add column if not exists shipping_from_bairro  text,
  add column if not exists shipping_from_cidade  text,
  add column if not exists shipping_from_uf      char(2);
