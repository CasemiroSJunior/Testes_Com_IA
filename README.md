# IA_com_testes

Projeto base com TypeScript, Prisma (SQLite) e Jest.

Quickstart

1. Instale dependências

   npm install

2. Gere o client do Prisma e rode a migração inicial (usa SQLite):

   npx prisma generate
   npx prisma migrate dev --name init

3. Pegue uma key do GEMINI e coloque conforme exememplo em .env.example 

4. Rodar em modo desenvolvimento

   npm run dev

5. Rodar testes:

   npm test

6. Como é um teste com API, pode acessar 'localhost:3000/docs' para verificar os endpoints. 
