# Arlancell - pacote completo (v2)

Contém a correção do painel admin (Supabase) + o novo visual do site.

## Passo 1 - Banco (Supabase) - só se ainda não fez
1. Abra `supabase/setup.sql`, troque `SEU_EMAIL_AQUI` pelo e-mail do seu login do admin.
2. Supabase -> SQL Editor -> New query -> cole tudo -> Run.
3. (Opcional) `supabase/seed-produtos.sql` importa 8 produtos de exemplo se a tabela estiver vazia.
4. Authentication -> desligue "Allow new users to sign up".

## Passo 2 - Código
Copie para a pasta do projeto, substituindo os arquivos:
- a pasta `src`
- o arquivo `index.html`
Depois: commit e push. O Cloudflare faz o deploy sozinho.
(Pode apagar `src/services/storage.js`; não é mais usado.)

## Passo 3 - Cloudflare
Variáveis: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.

## Depois de publicar
No /admin -> Configurações: preencha banner, WhatsApp, e-mail, endereço, horário e Instagram.
