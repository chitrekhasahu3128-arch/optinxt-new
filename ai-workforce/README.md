# AI Workforce Employee Portal

A full-stack web application for managing employee and manager workflows with role-based authentication and MongoDB integration.

## 🏗️ Project Structure

```
ai-workforce/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── User.js            # User schema with roles
│   ├── controllers/
│   │   └── authController.js  # Auth logic
│   ├── routes/
│   │   └── auth.js            # Auth endpoints
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── server.js              # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── Dashboards/
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   └── ManagerDashboard.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .env                   # MongoDB URI and config
└── package.json           # Root package.json
```

## 🚀 Features

- ✅ **Role-based Authentication** - Login as Employee or Manager
- ✅ **MongoDB Integration** - Secure credential storage
- ✅ **Employee Dashboard** - View tasks, productivity, and weekly overview
- ✅ **Manager Dashboard** - Manage team, approvals, and performance metrics
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs for security
- ✅ **Role-based Redirection** - Automatic redirect to appropriate dashboard

## 🔧 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## 📋 Installation

### 1. Clone and navigate to the project

```bash
cd ai-workforce
```

### 2. Install dependencies

```bash
npm run install:all
```

This will install dependencies for both frontend and backend.

### 3. Configure Environment Variables

#### Backend (.env)

```bash
# Database
MONGO_URI=mongodb+srv://bswati18000_db_user:PEOPLESTRAT1234@cluster18.cujjcum.mongodb.net/?appName=Cluster18

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5000
```

#### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5000/api
```

**Note:** The `.env` file with MongoDB URI is already provided in the root directory.

## 🏃 Running the Application

### Option 1: Run Both Frontend and Backend Concurrently

```bash
npm run dev
```

This will start both:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Option 2: Run Separately

**Backend:**
```bash
npm run backend:dev
```

**Frontend (in another terminal):**
```bash
npm run frontend:dev
```

## 🔐 Default Test Credentials

The system is pre-configured with demo credentials (you can create new users through the UI):

### Employee Account
- **Email:** employee@example.com
- **Password:** password123

### Manager Account
- **Email:** manager@example.com
- **Password:** password123

> **Note:** These credentials need to be created in the database first. You can create them via the registration endpoint or by directly seeding the database.

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ email, password, firstName, lastName, role }` |
| POST | `/api/auth/login` | User login | `{ email, password }` |
| GET | `/api/auth/me` | Get current user (Protected) | - |

### Request/Response Examples

#### Login Request
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "employee@example.com",
  "password": "password123"
}
```

#### Login Response (Success)
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
    "position": "Developer"
  }
}
```

#### Register Request
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "employee",
  "department": "Marketing",
  "position": "Marketing Manager"
}
```

## 🔄 Authentication Flow

1. **User logs in** → Sends credentials to `/api/auth/login`
2. **Backend validates** → Checks credentials against MongoDB
3. **JWT token generated** → Server returns token + user data
4. **Token stored** → Frontend stores in localStorage
5. **Role-based redirect** → 
   - Employee → `/employee-dashboard`
   - Manager → `/manager-dashboard`
6. **Protected routes** → All dashboard routes require valid JWT token

## 🛡️ Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Validation:** Token verification on protected routes
- **Role-based Access:** Route guards based on user role
- **CORS Configuration:** Restricted to frontend URLs
- **Environment Variables:** Sensitive data in .env file

## 📱 Frontend Routes

| Route | Role | Component |
|-------|------|-----------|
| `/login` | Public | Login page |
| `/employee-dashboard` | Employee | Employee Dashboard |
| `/manager-dashboard` | Manager | Manager Dashboard |
| `/` | Public | Redirects to /login |

## 🗄️ Database Schema

### User Model

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['employee', 'manager']),
  department: String,
  position: String,
  phone: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Application

### 1. Register a New User

Use the login page or make a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "employee"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚢 Deployment

### Deploying to Production

1. **Update .env variables** in production environment
2. **Build frontend:**
   ```bash
   npm run frontend:build
   ```
3. **Deploy to Vercel/Netlify** for frontend
4. **Deploy backend to Heroku/Railway** for backend
5. **Update CORS_ORIGINS and FRONTEND_URL** for production URLs

## 🐛 Troubleshooting

### MongoDB Connection Issues

- ✅ Check if MONGO_URI is correct in .env
- ✅ Ensure IP is whitelisted in MongoDB Atlas
- ✅ Verify database user credentials

### Login Not Working

- ✅ Check if backend is running (http://localhost:5000)
- ✅ Verify email/password match in database
- ✅ Check browser console for errors
- ✅ Check network tab for API responses

### Frontend Not Connecting to Backend

- ✅ Verify VITE_API_URL in frontend/.env
- ✅ Check CORS_ORIGINS in backend/.env
- ✅ Ensure both services are running

## 📖 Technologies Used

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS, Motion
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)

## 📄 Additional Notes

- Token expiration is set to 7 days (configurable via JWT_EXPIRE)
- Passwords are hashed before storing in the database
- All sensitive routes require valid JWT token
- Frontend automatically handles token expiration with logout

## 🤝 Support

For issues or questions, please check:
1. Backend logs: `npm run backend:dev`
2. Frontend console (F12)
3. MongoDB Atlas logs
4. Network tab in browser DevTools

---

**Happy coding! 🎉**
