# 🚀 Guia de Deployment

## Estrutura de Deployment

Este é um **monorepo** com:
- **Frontend:** React + Vite (em `src/`)
- **Backend:** Express.js (em `backend/`)

## ⚙️ Configuração Inicial (Local)

### 1. Backend - Criar `.env.local`

```bash
cd backend
cp .env.example .env.local
```

Preencha com suas credenciais Supabase e Cloudinary.

### 2. Supabase - Criar Tabelas

1. Vá para seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. SQL Editor → New Query
3. Cole o conteúdo de `backend/supabase.sql`
4. Execute

### 3. Rodar Localmente

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

Frontend em `http://localhost:5173`
Backend em `http://localhost:5000`

---

## 📦 Deploy no Vercel

### Opção 1: Monorepo com Backend como Função Serverless

**Vantagem:** Tudo no mesmo repositório, deploy automático

#### Passo 1: Preparar o Vercel

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Vá para "Settings" → "Environment Variables"
3. Adicione as variáveis de ambiente:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
```

#### Passo 2: Configurar Build

No Vercel, durante o setup inicial:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment:** Node.js

Se o Vercel pedir configuração de raiz:
- Crie `vercel.json` **na raiz** (já existe em `backend/`)

#### Passo 3: Atualizar Frontend

O frontend precisa apontar para o backend no Vercel. Atualizar `.env`:

```
VITE_API_BASE=https://your-backend-vercel-url.vercel.app
```

Ou configurar no Vercel como variável:

```
VITE_API_BASE=https://{VERCEL_URL}
```

#### Passo 4: Deploy

```bash
git add .
git commit -m "chore: prepare for vercel deployment"
git push origin main
```

Vercel faz deploy automático!

---

### Opção 2: Backend Separado (Mais Flexível)

Se quiser mais controle, crie um repositório separado para o backend.

#### Criar novo repositório

```bash
# Clone o projeto
git clone <repo>

# Crie uma branch só para o backend
git subtree split --prefix backend -b backend-only

# Crie um novo repo vazio no GitHub
# Depois:
git push <novo-repo-url> backend-only:main
```

Isso é mais complexo, então recomendo a Opção 1.

---

## 🔗 Integração Frontend ↔ Backend

Após deploy, o frontend precisa saber onde está o backend.

### Frontend (.env ou variáveis de ambiente)

```
VITE_API_BASE=https://seu-backend.vercel.app
```

### Exemplos de Requests

```javascript
// Login
const response = await fetch(
  `${import.meta.env.VITE_API_BASE}/api/auth/login`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }
);
```

---

## 🗄️ Supabase Setup

### 1. Criar Projeto

1. Vá para [Supabase](https://supabase.com)
2. Clique "New Project"
3. Selecione uma região próxima (ex: South America - São Paulo)
4. Crie banco de dados

### 2. Obter Credenciais

No projeto Supabase:
- Settings → API
- Copie: `URL` e `anon public key`
- Para `Service Key`, vá em "Service Role" secret

### 3. Criar Tabelas

SQL Editor → New Query → Cole `backend/supabase.sql` → Execute

### 4. Configurar Auth

Por padrão, Supabase Auth já está habilitado. Você pode:
- Habilitar email/password (já está)
- Habilitar OAuth (Google, GitHub, etc) - opcional

---

## ☁️ Cloudinary Setup

### 1. Criar Conta

1. Vá para [Cloudinary](https://cloudinary.com)
2. Sign up e crie conta
3. Confirme email

### 2. Obter Credenciais

No dashboard Cloudinary:
- Account details → Copy credentials
- Cloud Name, API Key, API Secret

### 3. Configurar Uploads

Recomendações:
- Upload presets (optional)
- Transformations (optional)
- CORS settings se necessário

---

## ✅ Checklist de Deploy

- [ ] `.env.local` preenchido localmente
- [ ] `supabase.sql` executado (tabelas criadas)
- [ ] Backend testado: `curl http://localhost:5000/health`
- [ ] Frontend conecta ao backend local
- [ ] Variáveis de ambiente no Vercel configuradas
- [ ] `VITE_API_BASE` apontando para backend correto
- [ ] Deploy realizado no Vercel
- [ ] Testar login no app publicado
- [ ] Testar upload de imagem/vídeo
- [ ] Verificar dados no Supabase

---

## 🐛 Troubleshooting

**"Backend not responding"**
- Verifique se `VITE_API_BASE` está correto
- Backend deve estar rodando (local) ou deployado (prod)

**"CORS error"**
- Verifique CORS no `backend/src/app.ts`
- `origin` deve incluir URL do frontend

**"Supabase connection error"**
- Verifique `SUPABASE_URL` e `SUPABASE_ANON_KEY`
- Confirme se tabelas foram criadas

**"Upload para Cloudinary falha"**
- Verifique credenciais do Cloudinary
- Limite de cota atingido?

---

## 📊 Monitoramento em Produção

### Vercel Logs

```bash
vercel logs
```

### Supabase Logs

Dashboard → Logs → Real-time → Veja requests à API

### Cloudinary Usage

Dashboard → Usage → Veja uploads e transformações

---

## 🔐 Segurança

✅ **Configurado:**
- RLS no Supabase (usuários só veem dados deles)
- JWT validation no backend
- CORS restritivo
- Variáveis sensíveis em environment variables

⚠️ **Recomendações Futuras:**
- Rate limiting no backend
- HTTPS everywhere
- Audit logs
- Backup automático Supabase
