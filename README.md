# WBlog API

API REST para gerenciamento de usuários, autenticação e entregas com histórico de movimentações.

## Tecnologias

- Node.js
- TypeScript (tipagem forte)
- Express
- Prisma ORM
- PostgreSQL
- JWT (`jsonwebtoken`)
- Zod (validação de payload)
- bcrypt (hash de senha)
- Docker Compose (ambiente local de banco)
- tsup / tsx

## Funcionalidades

- Cadastro e consulta de usuários
- Autenticação com JWT
- Autorização por perfil (`customer` e `sale`)
- Criação e consulta de entregas
- Atualização de status de entrega
- Registro e consulta de logs de entrega

## Pré-requisitos

- Node.js `22`
- npm
- PostgreSQL disponível (local) ou Docker

## Configuração do ambiente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto.

3. Use o arquivo `.env-example` como referência e defina as variáveis:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wblog"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

## Banco de dados

Este projeto utiliza Prisma com PostgreSQL.

1. Suba o banco com Docker Compose (opcional):

```bash
docker compose up -d
```

2. Execute as migrations:

```bash
npx prisma migrate deploy
```

Para desenvolvimento local:

```bash
npx prisma migrate dev
```

3. Gere o Prisma Client (também executado no `postinstall`):

```bash
npx prisma generate
```

Seed: não existe seed configurado atualmente.

## Executando a aplicação

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Scripts disponíveis

- `npm run dev` — executa a API com watch (`tsx`)
- `npm run build` — gera build ESM em `build/`
- `npm start` — executa `build/server.js`
- `npm run start:dev` — executa build com `.env`
- `npm run postinstall` — gera Prisma Client
- `npm test` — script padrão atual (sem suíte de testes implementada)

## Autenticação e autorização

A autenticação é feita com JWT no endpoint `POST /sessions`.

Use o header em rotas protegidas:

```http
Authorization: Bearer <token>
```

Regras implementadas:

- O token expira em `1d`
- O payload do token inclui `role`
- Perfis disponíveis:
  - `customer`
  - `sale`
- Rotas `/deliveries` exigem perfil `sale`
- `GET /delivery-logs/:id` aceita `customer` e `sale`, mas `customer` só pode consultar entregas próprias
- `POST /delivery-logs/:id` aceita apenas `sale`

## Endpoints

Base URL local: `http://localhost:3333`

### Usuários (`/users`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/users` | Lista usuários | Não |
| GET | `/users/:userId` | Busca usuário por ID | Não |
| POST | `/users` | Cria usuário | Não |

Request body (`POST /users`):

```json
{
  "name": "Maria Santos",
  "email": "maria@wblog.com",
  "password": "123456"
}
```

### Sessões (`/sessions`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/sessions` | Endpoint existente (retorna `null`) | Não |
| POST | `/sessions` | Autentica usuário e retorna token JWT | Não |

Request body (`POST /sessions`):

```json
{
  "email": "maria@wblog.com",
  "password": "123456"
}
```

### Entregas (`/deliveries`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/deliveries` | Lista entregas com dados do usuário e logs | Sim (`sale`) |
| GET | `/deliveries/:id` | Detalha uma entrega | Sim (`sale`) |
| POST | `/deliveries` | Cria entrega | Sim (`sale`) |
| PATCH | `/deliveries/:id/status` | Atualiza status da entrega | Sim (`sale`) |

Request body (`POST /deliveries`):

```json
{
  "user_id": "9f2e74d1-a33a-4e12-9aaf-68d3a8dc15bc",
  "description": "Notebook 14 polegadas"
}
```

Request body parcial (`PATCH /deliveries/:id/status`):

```json
{
  "status": "shipped"
}
```

Valores aceitos em `status`: `processing`, `shipped`, `delivered`.

### Logs de entrega (`/delivery-logs`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/delivery-logs/:id` | Lista logs de uma entrega | Sim (`customer`/`sale`) |
| POST | `/delivery-logs/:id` | Cria log de entrega | Sim (`sale`) |

Request body (`POST /delivery-logs/:id`):

```json
{
  "description": "Saiu para entrega no centro de distribuição"
}
```

Observações:

- Não há filtros/query params implementados atualmente
- `PATCH /deliveries/:id/status` também registra um log automaticamente com a descrição do novo status

## Respostas de erro

### Erro de validação (Zod)

```json
{
  "message": "validation error",
  "issues": {
    "formErrors": [],
    "fieldErrors": {
      "email": [
        "Invalid email"
      ]
    }
  }
}
```

### Erros de autenticação/autorização

```json
{
  "message": "JWT token not found"
}
```

```json
{
  "message": "Invalid JWT token"
}
```

```json
{
  "message": "Unauthorized"
}
```

### Erros de regra de negócio

```json
{
  "message": "Invalid email or password"
}
```

```json
{
  "message": "delivery not found"
}
```

```json
{
  "message": "change status to 'shipped'"
}
```

```json
{
  "message": "order already delivered"
}
```

## Licença

ISC
