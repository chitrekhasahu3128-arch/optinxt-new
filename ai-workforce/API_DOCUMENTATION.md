# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee",
  "department": "Engineering",
  "position": "Developer"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "department": "Engineering",
    "position": "Developer"
  }
}
```

**Validation:**
- `email`: Must be a valid email format and unique
- `password`: Minimum 6 characters
- `firstName`: Required
- `lastName`: Required
- `role`: Must be "employee" or "manager"

**Error Response (400 Bad Request):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate and get JWT token

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "employee@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "department": "Engineering",
    "position": "Senior Developer"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

**Error Response (403 Forbidden - Inactive Account):**
```json
{
  "message": "Account is inactive"
}
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get the current logged-in user's profile

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "employee@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "department": "Engineering",
    "position": "Senior Developer",
    "phone": "555-0101",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401 Unauthorized - No Token):**
```json
{
  "message": "No authentication token, authorization denied"
}
```

**Error Response (401 Unauthorized - Invalid Token):**
```json
{
  "message": "Token is not valid"
}
```

---

## cURL Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "department": "Engineering",
    "position": "Developer"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials or no token) |
| 403 | Forbidden (inactive account or insufficient permissions) |
| 500 | Server Error |

---

## JWT Token

The JWT token returned on login contains:
- User ID
- User Role (employee or manager)
- Expiration time (7 days)

**Sample Decoded Token:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "employee",
  "iat": 1705353000,
  "exp": 1705957800
}
```

---

## Frontend Usage

The frontend automatically:
1. Stores the token in localStorage
2. Adds the token to all API requests via Authorization header
3. Refreshes user data on login
4. Handles token expiration (redirects to login)

---

## Future Endpoints (To be implemented)

- `GET /api/employees` - List all employees (manager only)
- `GET /api/employees/:id` - Get employee details (manager or self)
- `PUT /api/employees/:id` - Update employee profile
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get user's tasks
- `PUT /api/tasks/:id` - Update task status
- `GET /api/team/performance` - Get team performance metrics (manager only)

