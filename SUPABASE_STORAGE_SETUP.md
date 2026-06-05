# Setup Supabase Storage

Para usar o upload de arquivos, você precisa criar um bucket de storage no Supabase.

## Passos:

1. **Abra o Supabase Console** do seu projeto
2. **Vá para "Storage"** no menu lateral
3. **Crie um novo bucket:**
   - Nome: `portfolio-media`
   - Marque "Public bucket" (caso contrário, os URLs públicos não funcionarão)
4. **Configure a política de acesso (RLS)** - Após criar o bucket:
   - Clique em "Policies" (ou "RLS Policies")
   - Crie uma política para permitir que usuários autenticados façam upload na sua própria pasta
   - Exemplo de política SQL:
     ```sql
     CREATE POLICY "Allow authenticated users to upload"
     ON storage.objects
     FOR INSERT
     TO authenticated
     WITH CHECK (bucket_id = 'portfolio-media');
     ```

## Estrutura do Storage

Os arquivos serão organizados assim:
```
portfolio-media/
├── images/
│   └── {timestamp}-{random}.{ext}
└── videos/
    └── {timestamp}-{random}.{ext}
```

Cada arquivo receberá uma URL pública que será salva no banco de dados.

## Próximas etapas

Com o bucket criado, o aplicativo pode fazer upload de arquivos automaticamente para o Supabase Storage quando você criar ou editar projetos.
