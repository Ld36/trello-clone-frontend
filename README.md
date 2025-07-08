
# Trello Clone - Frontend Angular

Um clone completo do Trello construído com Angular 17+, Angular Material e TypeScript, consumindo uma API REST em NestJS.

## 🌟 Funcionalidades

### ✅ Autenticação
- Sistema de login e registro
- Autenticação JWT
- Proteção de rotas
- Perfil do usuário
- Alteração de senha

### ✅ Gerenciamento de Boards
- Criar, editar e excluir quadros
- Visualização em grid responsivo
- Cores personalizáveis
- Quadros públicos/privados

### ✅ Listas e Cartões
- Criar, editar e excluir listas
- Criar, editar e excluir cartões
- Drag & Drop entre listas
- Reordenação de itens
- Labels coloridas
- Datas de vencimento
- Status de conclusão

### ✅ Interface Moderna
- Design similar ao Trello
- Responsivo (mobile/desktop)
- Animações suaves
- Loading states
- Tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **Angular 17+** - Framework principal
- **Angular Material** - Componentes UI
- **Angular CDK** - Drag and Drop
- **TypeScript** - Tipagem estática
- **RxJS** - Programação reativa
- **SCSS** - Estilização
- **Angular Animations** - Animações

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- API Backend rodando em `http://localhost:3000`

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a API base URL (se necessário):
```typescript
// src/app/core/services/*.service.ts
private readonly baseUrl = 'http://localhost:3000';
```

3. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

4. Acesse a aplicação em `http://localhost:4200`

## 🏗️ Estrutura do Projeto

```
src/app/
├── core/                   # Serviços e utilitários centrais
│   ├── guards/            # Guards de autenticação
│   ├── interceptors/      # Interceptors HTTP
│   ├── models/           # Interfaces TypeScript
│   └── services/         # Serviços da aplicação
├── features/             # Módulos de funcionalidades
│   ├── auth/            # Autenticação
│   ├── dashboard/       # Dashboard principal
│   ├── board/           # Visualização de boards
│   └── profile/         # Perfil do usuário
├── shared/              # Componentes compartilhados
│   └── components/      # Componentes reutilizáveis
└── layouts/             # Layouts da aplicação
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. O token é armazenado no localStorage e automaticamente incluído nas requisições via interceptor.

### Endpoints de Autenticação:
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /auth/me` - Perfil atual
- `POST /auth/forgot-password` - Esqueci a senha
- `POST /auth/reset-password` - Redefinir senha

## 📡 API Integration

### Base URL
```typescript
http://localhost:3000
```

### Principais Endpoints:
- `GET/POST /boards` - Gerenciar boards
- `GET/POST /lists` - Gerenciar listas
- `GET/POST /cards` - Gerenciar cartões
- `POST /cards/:id/move` - Mover cartões
- `POST /cards/:id/toggle-complete` - Alternar status

## 🎨 Customização

### Cores do Tema
As cores podem ser personalizadas no arquivo `src/styles.scss`:

```scss
$primary: mat.define-palette(mat.$blue-palette);
$accent: mat.define-palette(mat.$amber-palette);
$warn: mat.define-palette(mat.$red-palette);
```

### Componentes Reutilizáveis
- `LoadingComponent` - Indicador de carregamento
- `ConfirmDialogComponent` - Diálogo de confirmação
- `CardComponent` - Cartão individual
- `ListComponent` - Lista de cartões

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
ng serve

# Build de produção
ng build

# Testes unitários
ng test

# Linting
ng lint

# Formatação
ng format
```

## 🚦 Guias de Rotas

### Rotas Públicas
- `/auth/login` - Página de login
- `/auth/register` - Página de registro

### Rotas Protegidas
- `/dashboard` - Dashboard principal
- `/board/:id` - Visualização de board
- `/profile` - Perfil do usuário

**Desenvolvido com ❤️ usando Angular**
