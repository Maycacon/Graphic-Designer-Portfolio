# Backend API - Graphic Designer Portfolio

Backend Express.js para gerenciar upload de vídeos, LEDs e flyers com integração Supabase + Cloudinary.

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Contas criadas em:
  - [Supabase](https://supabase.com)
  - [Cloudinary](https://cloudinary.com)

## 🚀 Setup Inicial

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

**Variáveis necessárias:**

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
NODE_ENV=development
```

### 3. Criar Tabelas no Supabase

1. Abra o console Supabase do seu projeto
2. Vá para "SQL Editor" > "New Query"
3. Cole o conteúdo de `supabase.sql`
4. Execute a query

Isso criará:
- Tabela `projects` com RLS habilitado
- Índices para performance
- Políticas de segurança por usuário

### 4. Rodar o Backend em Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5000`

Verifique se está funcionando:
```bash
curl http://localhost:5000/health
```

## 📡 Endpoints da API

### Autenticação

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "secure-password"
}
```

Resposta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

### Projetos

Todos os endpoints de projetos requerem autenticação via header:
```
Authorization: Bearer {token}
```

**GET** `/api/projects?type=videos`
- Lista projetos do usuário
- Query params: `?type=videos|leds|flyers` (opcional)

**GET** `/api/projects/:id`
- Obtém um projeto específico

**POST** `/api/projects`
```json
{
  "type": "videos",
  "title": "Meu Vídeo",
  "description": "Descrição do projeto",
  "category": "Vídeos",
  "image_url": "https://cloudinary.com/...",
  "video_url": "https://cloudinary.com/..." // opcional
}
```

**PUT** `/api/projects/:id`
```json
{
  "title": "Novo Título",
  "description": "Nova descrição",
  ...
}
```

**DELETE** `/api/projects/:id`
- Deleta um projeto (retorna 204)

### Upload

**POST** `/api/upload?type=videos`
- Form data com arquivo
- Headers: `Authorization: Bearer {token}`

Exemplo com curl:
```bash
curl -X POST http://localhost:5000/api/upload?type=videos \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@video.mp4"
```

Resposta:
```json
{
  "url": "https://res.cloudinary.com/...",
  "public_id": "portfolio/videos/...",
  "type": "video"
}
```

## 🏗️ Arquitetura

```
src/
├── routes/
│   ├── auth.ts       # Autenticação
│   ├── projects.ts   # CRUD de projetos
│   └── upload.ts     # Upload para Cloudinary
├── services/
│   ├── supabase.ts   # Cliente Supabase
│   └── cloudinary.ts # Cliente Cloudinary
├── middleware/
│   └── auth.ts       # Validação de JWT
├── types/
│   └── index.ts      # Tipos TypeScript
├── app.ts            # Setup Express
└── index.ts          # Entry point
```

## 🔒 Segurança

- ✅ RLS habilitado no Supabase (usuários só veem seus próprios dados)
- ✅ Autenticação via JWT (tokens Supabase)
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho de arquivo (10MB imagens, 100MB vídeos)
- ✅ CORS configurado

## 📦 Build & Deploy

### Build

```bash
npm run build
```

Gera arquivos compilados em `dist/`

### Deploy no Vercel

1. Comita o código
2. Conecte o repositório no Vercel
3. Configure variáveis de ambiente no Vercel (SUPABASE_*, CLOUDINARY_*)
4. Deploy automático em cada push

## 🐛 Troubleshooting

**"Missing Supabase configuration"**
- Verifique se `.env.local` tem `SUPABASE_URL` e `SUPABASE_ANON_KEY`

**"Invalid token"**
- Token JWT expirado ou inválido
- Faça login novamente

**"File too large"**
- Excedeu limite de tamanho (10MB imagens, 100MB vídeos)

**CORS errors**
- Atualize `FRONTEND_URL` no `.env.local`
- Verifique se frontend está fazendo requests para `http://localhost:5000` (dev)

## 📝 Próximas Melhorias

- [ ] Validação de extensões de arquivo
- [ ] Cache de imagens/vídeos
- [ ] Webhooks para processar vídeos
- [ ] Rate limiting
- [ ] Logs estruturados
