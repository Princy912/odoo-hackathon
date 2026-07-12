# TransitOps 🚌

> A hackathon monorepo for real-time transit operations management.

## Project Structure

```
transitops/
├── backend/          # Spring Boot 3 REST API (Java 17, Maven)
├── frontend/         # React 18 + Vite SPA
├── docs/
│   └── API.md        # API reference
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Spring Boot 3 · Java 17 · Maven |
| Database   | MySQL 8 |
| Auth       | Spring Security · JWT (jjwt 0.12) |
| Frontend   | React 18 · Vite · Tailwind CSS |
| HTTP       | Axios |
| Forms      | React Hook Form · Zod |
| Charts     | Recharts |
| Routing    | React Router DOM v6 |

---

## Prerequisites

- **Java 17+** — `java --version`
- **Maven 3.9+** — `mvn --version`
- **Node 18+** — `node --version`
- **MySQL 8** running locally (or Docker)

---

## Getting Started

### 1. Clone & configure

```bash
git clone <repo-url> transitops
cd transitops
```

Copy and edit the backend config:

```bash
cp backend/src/main/resources/application.properties \
   backend/src/main/resources/application-local.properties
# Edit application-local.properties with your MySQL credentials
```

### 2. Create MySQL database

```sql
CREATE DATABASE transitops_db;
```

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### 4. Start the frontend

```bash
cd frontend
npm install   # first time only
npm run dev
# App available at http://localhost:5173
```

> The Vite dev server proxies `/api/*` requests to `http://localhost:8080` automatically — no CORS config required in development.

---

## Verify the Setup

- **Backend health:** `curl http://localhost:8080/api/health`
  ```json
  { "status": "UP", "message": "Hello TransitOps" }
  ```
- **Frontend:** Open [http://localhost:5173](http://localhost:5173) — you should see the **Hello TransitOps** landing page.

---

## API Reference

See [`docs/API.md`](docs/API.md) for the full endpoint reference.

---

## Environment Variables / Secrets

Never commit real credentials. Use `application-local.properties` (git-ignored) for local overrides.

| Property | Description |
|----------|-------------|
| `spring.datasource.url` | JDBC URL for MySQL |
| `spring.datasource.username` | DB username |
| `spring.datasource.password` | DB password |
| `jwt.secret` | ≥32-char random secret for signing JWTs |

---

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and open a PR.

---

*Built with ❤️ for the hackathon.*
