# Adora Club

Site do Adora Club, um clube do livro com uma seção de comunidade onde cada
membro tem login próprio e pode:

- postar o livro que está lendo no momento, com progresso por página ou
  porcentagem;
- publicar resenhas com nota (1 a 5 estrelas);
- curtir e comentar as postagens de outros membros;
- ver o feed de todo o clube ou o perfil de um membro específico.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) com SQLite (via `@prisma/adapter-better-sqlite3`)
- [Auth.js / NextAuth](https://authjs.dev) (credenciais: usuário + senha)

## Rodando localmente

```bash
npm install
cp .env.example .env   # gere um AUTH_SECRET com: openssl rand -base64 32
npx prisma migrate dev
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

- `src/app` — páginas e rotas de API (App Router)
- `src/app/clube` — feed do clube do livro (protegido por login)
- `src/app/perfil/[username]` — perfil público de cada membro
- `src/components/club` — composer de posts e cartão de post (progresso/resenha)
- `prisma/schema.prisma` — modelos `User`, `Post`, `Like`, `Comment`
