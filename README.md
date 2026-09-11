# AI image generator

A React and Express application for generating images, saving them to a private
S3 bucket, and browsing each signed-in user's gallery. PostgreSQL stores users
and image records. Authentication uses bcrypt password hashes and JWTs; inputs
are validated with Zod.

## Requirements

- Node.js 22, npm, PostgreSQL 17, and the `psql` client.
- An OpenAI API key with image-generation access.
- A private S3 bucket and AWS credentials with `s3:PutObject`, `s3:GetObject`,
  and `s3:DeleteObject` access to its `v1/prod/generated/*` prefix. Keep the
  bucket private; the backend signs gallery URLs.

## Local setup

```sh
npm ci --prefix backend
npm ci --prefix frontend
cp backend/.env.example backend/.env
```

Fill in `backend/.env`. Generate a unique JWT signing secret with
`openssl rand -hex 32`; the app refuses to start with a missing or short secret.
Never commit this file.

For a fresh local PostgreSQL database, one option is:

```sh
docker run --name image-generator-db -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=local-dev-only -e POSTGRES_DB=image_generator \
  -p 127.0.0.1:5433:5432 -d postgres:17
psql 'postgresql://postgres:local-dev-only@localhost:5433/image_generator' \
  -c 'CREATE SCHEMA IF NOT EXISTS app;'
cd backend
npm run db:migrate
npm run dev
```

The existing migration series expects the `app` schema to exist. Run migration
commands only against the database configured for this app. In a second terminal:

```sh
cd frontend
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`), register an account, and
create an image. The frontend currently calls the backend at
`http://localhost:3000`, so this setup is for local development.

## Verification and builds

```sh
npm test --prefix backend
npm run build --prefix backend
npm run build --prefix frontend
cd backend && npm start
```

Unit tests mock the database, S3, and image provider. They do not need credentials,
run migrations, or spend API credit. They cover authentication and the image
persistence failure paths. Live provider integration is not exercised by them.

## How image saving works

The backend validates the prompt, generates an image, uploads it, then inserts its
gallery record. It reports success only after both storage operations finish.
An upload failure creates no gallery row. If inserting the row fails, the backend
attempts to remove the uploaded object. A failed cleanup is logged for an operator
to reconcile; S3 and PostgreSQL do not share a transaction. A process crash between
upload and insert can also leave an unreferenced object.

Object keys keep the existing `.png` naming convention; S3's Content-Type header
comes from the generated image. Gallery links expire after an hour.

This is a portfolio application. Before operating a public hosted service, add
rate limits and per-user generation quotas, configure HTTPS and the API base URL,
and verify provider behavior using a dedicated environment.
