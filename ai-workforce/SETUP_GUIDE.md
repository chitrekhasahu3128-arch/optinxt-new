# AI Workforce Portal - Installation & Setup Guide

## 📦 Quick Start

### Step 1: Install Dependencies

```bash
cd c:\Users\chitr\OneDrive\Desktop\optinext\ai-workforce
npm run install:all
```

### Step 2: Seed Database with Demo Users

```bash
cd backend
node seed.js
```

**Expected Output:**
```
✅ Seeded 4 users
📋 Created Users:
- employee@example.com (employee) - John Doe
- manager@example.com (manager) - Jane Smith
- employee2@example.com (employee) - Mike Johnson
- manager2@example.com (manager) - Sarah Williams
```

### Step 3: Run the Application

```bash
# From root directory
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173)

---

## 🌐 Access the Application

- **Login Page:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@example.com | password123 |
| Manager | manager@example.com | password123 |
| Employee 2 | employee2@example.com | password123 |
| Manager 2 | manager2@example.com | password123 |

## 📁 Complete File Structure

```
ai-workforce/
│
├── 📄 .env                           # Environment variables (MongoDB URI included)
├── 📄 .env.example                   # Example env file
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Root project config
├── 📄 README.md                      # Main documentation
│
├── 📂 backend/                       # Express.js Backend
│   ├── 📄 server.js                  # Main server entry point
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 seed.js                    # Database seeding script
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                  # MongoDB connection
│   │
│   ├── 📂 models/
│   │   └── 📄 User.js                # User schema with password hashing
│   │
│   ├── 📂 controllers/
│   │   └── 📄 authController.js      # Login, Register, GetMe logic
│   │
│   ├── 📂 routes/
│   │   └── 📄 auth.js                # Auth endpoints definition
│   │
│   └── 📂 middleware/
│       └── 📄 auth.js                # JWT verification & role checking
│
└── 📂 frontend/                      # React.js Frontend
    ├── 📄 index.html                 # HTML entry point
    ├── 📄 vite.config.js             # Vite configuration
    ├── 📄 tailwind.config.js         # Tailwind CSS config
    ├── 📄 postcss.config.js          # PostCSS config
    ├── 📄 package.json               # Frontend dependencies
    ├── 📄 tsconfig.json              # TypeScript config
    ├── 📄 .env                       # Frontend env variables
    │
    └── 📂 src/
        ├── 📄 main.jsx               # React app entry point
        ├── 📄 App.jsx                # Main app component with routing
        ├── 📄 index.css              # Global styles
        │
        ├── 📂 context/
        │   └── 📄 AuthContext.jsx    # Auth state management
        │
        ├── 📂 components/
        │   ├── 📄 PrivateRoute.jsx   # Protected route wrapper
        │   │
        │   ├── 📂 Auth/
        │   │   └── 📄 Login.jsx      # Login form component
        │   │
        │   └── 📂 Dashboards/
        │       ├── 📄 EmployeeDashboard.jsx    # Employee dashboard
        │       └── 📄 ManagerDashboard.jsx     # Manager dashboard
        │
        └── 📂 services/
            └── (Future API service files)
```

## 🔌 API Architecture

### Backend Authentication Flow

```
POST /api/auth/login
    ↓
Database lookup (email match)
    ↓
Password comparison (bcryptjs.compare)
    ↓
JWT token generation (7-day expiry)
    ↓
Response with token + user data
```

### Frontend Authentication Flow

```
User fills login form
    ↓
POST request to /api/auth/login
    ↓
Save token & user to localStorage
    ↓
Set Authorization header
    ↓
Redirect based on role
    ├─ "employee" → /employee-dashboard
    └─ "manager" → /manager-dashboard
```

## 🛡️ Security Implementation

### Password Security
- Passwords hashed with bcryptjs (10 salt rounds)
- Never transmitted or stored in plaintext
- Hashing done before database save

### JWT Security
- Token generated on login with 7-day expiry
- Stored in localStorage (frontend)
- Verified on protected routes
- Includes user ID and role

### Route Protection
- All dashboard routes require valid JWT token
- Role-based middl ware checks user permissions
- Automatic redirect for unauthorized access

## 📊 Database Connection

**MongoDB Connection String:**
```
mongodb+srv://bswati18000_db_user:PEOPLESTRAT1234@cluster18.cujjcum.mongodb.net/?appName=Cluster18
```

**Collections Created:**
- `users` - All user accounts with credentials and roles

**User Document Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "employee@example.com",
  "password": "$2a$10$hashed_password_here",
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
```

## 🚀 Running Components Separately

**Backend only:**
```bash
cd backend
npm run dev
```
- Runs on http://localhost:5000
- API available at http://localhost:5000/api

**Frontend only:**
```bash
cd frontend
npm run dev
```
- Runs on http://localhost:5173
- Connects to backend at http://localhost:5000/api

## ✅ Verification Checklist

After setup, verify:

- [ ] MongoDB connection successful (check console logs)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Demo users seeded in database
- [ ] Can login with employee@example.com
- [ ] Can login with manager@example.com
- [ ] Employee redirects to Employee Dashboard
- [ ] Manager redirects to Manager Dashboard
- [ ] Logout clears token and redirects to login
- [ ] Cannot access dashboards without authentication

## 🔧 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run install:all` | Install all dependencies |
| `npm run dev` | Start both frontend & backend |
| `npm run backend:dev` | Start backend only |
| `npm run frontend:dev` | Start frontend only |
| `npm run frontend:build` | Build frontend for production |
| `node backend/seed.js` | Seed demo users to database |

## 🐛 Debugging Tips

**Backend Issues:**
- Check `npm run backend:dev` console for errors
- Verify MongoDB URI in `.env`
- Check network tab in browser for API errors

**Frontend Issues:**
- Check browser console (F12)
- Verify `VITE_API_URL` in frontend`.env`
- Check Network tab for API calls

**Database Issues:**
- Verify MongoDB Atlas IP whitelist
- Check user permissions in MongoDB
- Test connection manually with MongoDB Compass

## 📞 Support

If you encounter issues:

1. Check the README.md for detailed documentation
2. Review backend logs: `npm run backend:dev`
3. Check browser console: press F12
4. Verify all environment variables in `.env` files
5. Ensure MongoDB connection string is correct

---

**You're all set! 🎉 Start developing!**
