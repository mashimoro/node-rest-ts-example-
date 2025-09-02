# Node REST TypeScript Example (with MongoDB + Unit Tests)

Contents:
- `src/` : application source (Express + Controller/Service/Repository)
- `src/repositories/todo.repository.mongo.ts` : Mongoose-based repository
- `tests/` : Jest unit tests for TodoService and TodoRepository (mocked)
- `package.json`, `tsconfig.json`, `jest.config.json`

Notes:
- This repo is a fully-contained example. To run locally:
  1. Install dependencies: `npm install`
  2. Start MongoDB (if using Mongo repository) and set `MONGO_URI` env var.
  3. Run dev server: `npm run dev`
  4. Run tests: `npm test`

The in-memory repository (src/repositories/todo.repository.ts) remains available for quick local tests without MongoDB.
