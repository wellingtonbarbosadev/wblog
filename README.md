# WBlog API

API REST para gestão de usuários, autenticação e fluxo de entregas com histórico de movimentações.

## Tecnologias

- Node.js
- TypeScript (tipagem forte)
- Express
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- Zod (validação de dados)
- bcrypt (hash de senhas)
- Docker Compose (ambiente de banco local)
- tsup / tsx

## Funcionalidades

- Cadastro e consulta de usuários
- Autenticação com geração de token JWT
- Controle de acesso por perfil (`customer` e `sale`)
- Criação e consulta de entregas
- Atualização de status da entrega
- Registro e consulta de logs de entrega

## Pré-requisitos

- Node.js **22** (mínimo recomendado no projeto)
- npm
- PostgreSQL disponível localmente ou via Docker

## Configuração do ambiente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto.

3. Preencha as variáveis com base no `.env-example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wblog"
JWT_SECRET="sua_chave_secreta"
PORT=3333
```

## Banco de dados

O projeto usa Prisma com PostgreSQL.

1. Suba o banco com Docker Compose (opcional):

```bash
docker compose up -d
```

2. Execute as migrations:

```bash
npx prisma migrate deploy
```

Para desenvolvimento local, também pode usar:

```bash
npx prisma migrate dev
```

3. Gerar o client Prisma (já executado no `postinstall`):

```bash
npx prisma generate
```

Observação: não há seed configurado no projeto atualmente.

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

- `npm run dev` — inicia em modo desenvolvimento com watch
- `npm run build` — gera build em `build/`
- `npm start` — executa a aplicação compilada
- `npm run start:dev` — executa a aplicação compilada lendo `.env`
- `npm test` — script padrão atual (retorna erro pois não há testes implementados)
- `npm run postinstall` — gera Prisma Client

## Autenticação e autorização

A autenticação é feita via JWT no endpoint de sessão.

- Header obrigatório para rotas protegidas:

```http
Authorization: Bearer <token>
```

- Expiração do token: `1d`
- O payload inclui o `role` do usuário
- Perfis existentes:
  - `customer`
  - `sale`

Regras de autorização implementadas:

- Rotas de `/deliveries` exigem usuário autenticado com perfil `sale`
- `GET /delivery-logs/:id` permite `customer` e `sale`, mas `customer` só pode ver logs das próprias entregas
- `POST /delivery-logs/:id` permite apenas `sale`

## Endpoints

Base URL local (exemplo): `http://localhost:3333`

### Usuários (`/users`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/users` | Lista todos os usuários | Não |
| GET | `/users/:userId` | Busca usuário por ID | Não |
| POST | `/users` | Cria usuário | Não |

**Exemplo de request — criar usuário**

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
| GET | `/sessions` | Endpoint existente (retorno vazio) | Não |
| POST | `/sessions` | Autentica usuário e retorna JWT | Não |

**Exemplo de request — login**

```json
{
  "email": "maria@wblog.com",
  "password": "123456"
}
```

### Entregas (`/deliveries`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/deliveries` | Lista entregas com usuário e logs | Sim (`sale`) |
| GET | `/deliveries/:id` | Detalha uma entrega | Sim (`sale`) |
| POST | `/deliveries` | Cria entrega | Sim (`sale`) |
| PATCH | `/deliveries/:id/status` | Atualiza status da entrega | Sim (`sale`) |

**Exemplo de request — criar entrega**

```json
{
  "user_id": "9f2e74d1-a33a-4e12-9aaf-68d3a8dc15bc",
  "description": "Notebook 14 polegadas"
}
```

**Exemplo de request — atualização parcial de status (PATCH)**

```json
{
  "status": "shipped"
}
```

Valores aceitos para `status`: `processing`, `shipped`, `delivered`.

### Logs de entrega (`/delivery-logs`)

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| GET | `/delivery-logs/:id` | Lista logs de uma entrega | Sim (`customer`/`sale`) |
| POST | `/delivery-logs/:id` | Cria novo log para entrega | Sim (`sale`) |

**Exemplo de request — criar log de entrega**

```json
{
  "description": "Saiu para entrega no centro de distribuição"
}
```

Observações:

- Não há filtros/query params implementados nos endpoints atuais.
- Ao atualizar status em `PATCH /deliveries/:id/status`, um log é criado automaticamente com a descrição igual ao status.

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

### Erro de autenticação/autorização

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

### Erro de regra de negócio

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

## Licença

ISC
