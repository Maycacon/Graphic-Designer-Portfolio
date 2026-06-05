# Configuração do Novo Sistema Supabase

Parabéns! A migração para um sistema Supabase-first foi concluída. Agora você não precisa mais rodar o backend Express localmente.

## O que mudou?

✅ **Autenticação**: Agora usa Supabase Auth diretamente  
✅ **API de Projetos**: Usa Supabase PostgREST (RLS automático)  
✅ **Upload**: Usa Supabase Storage em vez de Cloudinary  
✅ **Sem backend local**: Não precisa rodar Express em localhost:5000  

## Como começar?

### 1. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

Onde encontrar essas credenciais:
- Abra o [Supabase Console](https://supabase.com)
- Vá para "Settings" → "API" na seção do seu projeto
- Copie `Project URL` (VITE_SUPABASE_URL)
- Copie `anon public` key (VITE_SUPABASE_ANON_KEY)

### 2. Crie o bucket de storage

1. No Supabase Console, vá para "Storage"
2. Clique em "Create bucket"
3. Nome: `portfolio-media`
4. Marque "Public bucket"
5. Clique em "Create"

Para mais detalhes, veja [SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md)

### 3. Inicie apenas o frontend

```bash
npm run dev
```

Pronto! O app iniciará em `http://localhost:5173` (ou a porta que Vite configurar)

**Nenhum backend rodando, nenhum erro de conexão!**

## Testando

1. Abra `http://localhost:5173`
2. Vá para a seção Admin
3. Faça login com suas credenciais Supabase (email e senha que você criou)
4. Crie um novo projeto - o arquivo será salvo no Supabase Storage
5. Verifique que os projetos aparecem corretamente

## Arquivos criados/modificados

**Novos arquivos:**
- `src/lib/supabase.ts` - Cliente Supabase
- `src/lib/useSupabaseAuth.ts` - Hook de autenticação
- `src/lib/useSupabaseProjects.ts` - Hook de operações de projetos
- `src/lib/useSupabaseStorage.ts` - Hook de upload
- `.env.example` - Variáveis de ambiente
- `SUPABASE_STORAGE_SETUP.md` - Setup do storage

**Modificados:**
- `src/app/pages/admin-page.tsx` - Agora usa Supabase em vez de backend
- `src/app/lib/useAdminProjects.ts` - Agora usa Supabase em vez de backend
- `package.json` - Adicionado `@supabase/supabase-js`

## Próximas etapas

- ✅ O backend Express ainda existe em `backend/` se precisar de referência, mas não é mais necessário
- ✅ Você pode opcionalmente deletar a pasta `backend/` após confirmar que tudo funciona
- ✅ Deploy: Basta fazer deploy do frontend em Vercel/Netlify - sem necessidade de backend separado

## Troubleshooting

**Erro: "Missing Supabase configuration"**
- Verifique se `.env.local` existe e tem `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

**Erro: "Bucket not found"**
- Veja [SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md) para criar o bucket

**Erro ao fazer login**
- Verifique se o usuário existe em Supabase Auth (Settings → Users)
- Confirm email se necessário

**Arquivos não aparecem após upload**
- Verifique se o bucket `portfolio-media` é público
- Verifique se as políticas de RLS do storage estão corretas

## Recursos

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
