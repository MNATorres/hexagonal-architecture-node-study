# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A study REST API demonstrating Hexagonal Architecture (Ports & Adapters) in Node.js/TypeScript. The single domain is `User` with full CRUD.

## Commands

- `docker-compose up -d` — start PostgreSQL (5432) and pgAdmin (5050, `admin@admin.com` / `admin`). Required before running the app.
- `npm run dev` — start the API on port 3000 via nodemon + ts-node (entry: `src/04_Main_DependencyInjectionAndSetup/index.ts`).
- `npm test` — run the Jest suite.
- `npx jest path/to/file.test.ts` — run a single test file.
- `npx jest -t "test name"` — run tests matching a name.
- `npx tsc --noEmit` — type-check without emitting.
- `npx eslint src` — lint (no npm script exists for this).

Note: there is **no build script**; the app runs directly through ts-node in dev. `tsconfig.json` outputs to `dist/` if you compile manually.

## Architecture

Code is organized into four numbered layers following the Dependency Rule (dependencies point inward toward the domain). The numeric directory prefixes encode layer order — preserve them when adding files.

- **`01_Domain_EnterpriseBusinessRules/`** — Pure business logic. `User` entity self-validates in its constructor and throws `DomainException`. No framework, HTTP, or DB imports allowed here.
- **`02_Application_UseCasesAndPorts/`** — Use case orchestration and the port interfaces.
  - `In_Ports/IUserUseCases.ts` — interface the outside world calls into.
  - `Out_Ports/IUserRepository.ts` — interface the application requires from infrastructure (persistence), defined in terms of the **domain `User`**, not ORM types.
  - `UseCases/UserUseCasesImpl.ts` — implements `IUserUseCases`, depends only on the `IUserRepository` port (constructor-injected).
- **`03_Infrastructure_AdaptersAndFrameworks/`** — Concrete adapters.
  - `In_Adapters/` — `UserController` (Express) and `UserSchemas` (Zod). Controllers validate input with Zod, call In Ports, and translate `ZodError` → 400. Controller methods are bound to `this` in the constructor so they can be passed directly to the Express router.
  - `Out_Adapters/` — `TypeOrmUserRepository` implements `IUserRepository`; `UserOrmEntity` is the TypeORM entity; `DataSource.ts` configures the Postgres connection.
- **`04_Main_DependencyInjectionAndSetup/index.ts`** — Composition Root. The **only** place where concrete classes are instantiated and wired: DataSource → ORM repo → `TypeOrmUserRepository` → `UserUseCasesImpl` → `UserController` → routes. New features get assembled here.

### Key conventions

- **Domain/ORM separation:** `User` (domain) and `UserOrmEntity` (persistence) are distinct types. `TypeOrmUserRepository` owns the mapping via private `toDomain`/`toOrm` methods. Never let ORM types leak into the application or domain layers.
- **Dependency injection is manual** (constructor params), not a container. Layers depend on port interfaces, never on concrete implementations from an outer layer.
- **Validation is two-tiered:** Zod validates HTTP shape at the controller; the `User` constructor enforces business rules. Both must pass.

## Configuration

- DB connection reads `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` and `PORT` from `.env` (loaded via dotenv), with localhost/admin/password/hexagonal_db defaults matching `docker-compose.yml`.
- `DataSource` has `synchronize: true` (auto-schema) — dev only, do not use against a real database.
