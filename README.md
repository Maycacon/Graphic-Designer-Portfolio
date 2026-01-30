# Designer - Portfólio Profissional

Um portfólio moderno e responsivo desenvolvido com React, TypeScript, Tailwind CSS e Motion/Framer Motion. Perfeito para designers gráficos, editores de vídeo e profissionais de motion graphics.

## Características

- 🎨 Design moderno e responsivo
- ✨ Animações suaves com Motion/Framer Motion
- 📱 Mobile-first approach
- 🎯 SEO otimizado
- ⚡ Vite para build rápido
- 🎭 Componentes reutilizáveis com Radix UI
- 🌈 Tailwind CSS para styling

## Seções

- **Home**: Hero section com CTA
- **Sobre Mim**: Apresentação pessoal e habilidades
- **Serviços**: Edição de vídeos, Flyers e Motion Graphics
- **Portfólio**: 
  - Edição de Vídeos
  - Design de Flyers
  - Motion Graphics
- **Contato**: Formulário e informações de contato

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abre http://localhost:5173 no seu navegador.

## Build

```bash
npm run build
```

## Estrutura do Projeto

```
src/
├── main.tsx                    # Entry point
├── app/
│   ├── App.tsx                # Componente principal
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── services-section.tsx
│   │   ├── portfolio-section.tsx
│   │   ├── animated-shapes.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/                # Componentes Radix UI
│   └── pages/
│       ├── home-page.tsx
│       ├── contact-page.tsx
│       ├── portfolio-videos.tsx
│       ├── portfolio-flyers.tsx
│       └── portfolio-motion.tsx
└── styles/
    ├── index.css
    ├── fonts.css
    ├── tailwind.css
    └── theme.css
```

## Customização

### Cores
As cores principais estão configuradas como:
- Primary: `#7c3aed` (Purple)
- Accent: `#fde68a` (Yellow)

### Conteúdo
Edite os componentes em `src/app/components/` para customizar o conteúdo.

### Contato
Atualize as informações de contato em `src/app/pages/contact-page.tsx`

## Dependências Principais

- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS 4
- Motion (Framer Motion)
- Radix UI
- Lucide React

## Suporte

Para suporte, entre em contato através das informações na página de contato.

## Licença

Código original de https://www.figma.com/design/44ao9XOhJJkhYvBbSEpTP2/Graphic-Designer-Portfolio