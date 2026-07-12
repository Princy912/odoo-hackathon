# TransitOps API Documentation

Base URL: `http://localhost:8080/api`

---

## Authentication

> All protected endpoints require the `Authorization: Bearer <token>` header.

### POST `/api/auth/register`
Register a new user.

**Request Body**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

---

### POST `/api/auth/login`
Authenticate and receive a JWT token.

**Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** `200 OK`
```json
{
  "token": "eyJhbGci...",
  "type": "Bearer",
  "expiresIn": 86400
}
```

---

## Health Check

### GET `/api/health`
Returns a simple health status.

**Response** `200 OK`
```json
{
  "status": "UP",
  "message": "Hello TransitOps"
}
```

---

## Placeholder Sections (to be expanded)

- `GET /api/routes` — List transit routes
- `GET /api/routes/{id}` — Get route details
- `POST /api/routes` — Create route *(admin)*
- `PUT /api/routes/{id}` — Update route *(admin)*
- `DELETE /api/routes/{id}` — Delete route *(admin)*

---

*This document will be updated as endpoints are implemented.*
