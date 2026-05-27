alter table stores
  add column if not exists onboarding_completo boolean default false,
  add column if not exists onboarding_step integer default 0,
  add column if not exists segmento text;
