# API de Pagamento Multi-Gateway

## Requisitos

- Node.js 18+
- MySQL
- Docker (mocks dos gateways)

## Instalação

```bash
npm install
cp .env.example .env
```

## Rodar

```bash
node ace migration:run
node ace db:seed
node ace serve --hmr
```

## Mocks dos gateways

```bash
docker run -p 3001:3001 -p 3002:3002 matheusprotzen/gateways-mock
```

Credenciais do mock (já configuradas no `.env.example`):
- **Gateway 1**: email `dev@betalent.tech`, token `FEC9BB078BF338F464F96B48089EB498`
- **Gateway 2**: headers `Gateway-Auth-Token=tk_f2198cc671b5289fa856`, `Gateway-Auth-Secret=3d15e8ed6131446ea7e3456728b1211f`

## Rotas

### Públicas

- POST /login
- POST /purchase

### Privadas (Bearer token)

- GET /transactions
- GET /transactions/:id
- POST /transactions/:id/refund (ADMIN, FINANCE)
- GET /gateways (ADMIN)
- PATCH /gateways/:id/toggle (ADMIN)
- PATCH /gateways/:id/priority (ADMIN)
- CRUD /users (ADMIN, MANAGER)
- CRUD /products (ADMIN, MANAGER, FINANCE)
- GET /clients
- GET /clients/:id

## Usuários seed

admin@betalent.tech, manager@betalent.tech, finance@betalent.tech, user@betalent.tech — senha: password123

**Importante:** Produtos e Gateways exigem roles específicas. Use `admin@betalent.tech` para acessar tudo. O usuário `user@betalent.tech` retorna 403 em produtos e gateways.
