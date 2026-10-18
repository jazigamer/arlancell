# Correção do painel admin - Arlancell

## Passo 1 - Banco (Supabase)
1. Abra `supabase/setup.sql`, troque `SEU_EMAIL_AQUI` pelo e-mail do seu login do admin.
2. Supabase -> SQL Editor -> New query -> cole tudo -> Run.
3. (Opcional) Se a tabela de produtos estiver vazia e você quer os 8 produtos de exemplo: rode `supabase/seed-produtos.sql`.
4. Supabase -> Authentication -> Sign In / Providers: desligue "Allow new users to sign up" (só você entra).

## Passo 2 - Código (GitHub)
1. Descompacte este ZIP.
2. No GitHub: Add file -> Upload files -> arraste a pasta `src` (ela sobrescreve os arquivos).
3. Pode apagar `src/services/storage.js` (não é mais usado).
4. O Cloudflare faz o deploy sozinho.

## Passo 3 - Conferir no Cloudflare
Em Settings -> Variables and Secrets, precisam existir:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
(Depois de criar/alterar variáveis, faça um novo deploy.)

## Teste final
Entre no /admin, edite um produto, mude o vídeo em Configurações, e abra o site numa aba anônima: as mudanças devem aparecer.
