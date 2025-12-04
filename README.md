
# Daily Diet API

A **Daily Diet API** é uma API REST construída com **Fastify + TypeScript** para registrar refeições e controlar se estão dentro ou fora da dieta.

Ela serve para:

- Registrar refeições (nome, descrição, data/hora, se está ou não na dieta)
- Controlar os dados por usuário usando um cookie de sessão (`sessionId`)
- Calcular métricas da dieta, como:
  - total de refeições
  - quantas estão dentro da dieta
  - quantas estão fora
  - melhor sequência de refeições dentro da dieta

Ela resolve o problema de organização e acompanhamento de dieta de forma simples, rápida e focada em backend.

## Como utilizar? 

## 🛠 Instalação

### ✔ Pré-requisitos

- Node.js 18+
- SQLite
- npm ou pnpm instalado
- Arquivo `.env` configurado

### 📥 Passo a passo

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/daily-diet-api
cd daily-diet-api
npm install
``` 

Crie o arquivo .env na raiz do projeto:

```bash
DATABASE_URL=./db/app.db
NODE_ENV=development
PORT=4444
``` 

Rode as migrações do banco:

```bash
npm run knex migrate:latest
``` 

Inicie o servidor em ambiente de desenvolvimento:

```bash
npm run dev
``` 

Por padrão, a API sobe em: http://localhost:4444

Como usar
```bash
1. Criar usuário e receber cookie de sessão
``` 

Rota para criar usuário:

```bash
POST /users
Content-Type: application/json
``` 

Body:

```bash
{
  "name": "Erick",
  "email": "erick@example.com"
}
``` 

A resposta vai retornar um header parecido com:

```bash
Set-Cookie: sessionId=uuid-gerado; Path=/; HttpOnly
``` 

Esse sessionId é usado para autenticar todas as rotas protegidas.

2. Usar o cookie nas próximas requisições

Exemplo usando curl:

```bash
curl -X GET http://localhost:4444/meals \
  --header "Cookie: sessionId=seu-uuid-aqui"
  ``` 


## Rodando os testes

Para rodar os testes, rode o seguinte comando
Os testes são feitos com Vitest e Supertest, usando um banco dedicado (.env.test com ./db/test.db).

```bash
  npm run test
```


## Stack utilizada

**Front-end:** Em breve..

**Back-end:** 
- Node.js
- Fastify
- TypeScript
- Knex
- SQLite
- Zod
- Vitest
- Supertest


## 🔗 Links
[![portfolio](https://img.shields.io/badge/meu_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://erackson-souza.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/eracksonsouza/)
