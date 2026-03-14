# AI Workforce Portal - Complete Directory Structure

```
ai-workforce/                                      # Root directory
├── 📄 .env                                       # MongoDB URI and config
├── 📄 .env.example                               # Example env file
├── 📄 .gitignore                                 # Git ignore rules
├── 📄 package.json                               # Root dependencies
├── 📄 README.md                                  # Main documentation
├── 📄 SETUP_GUIDE.md                            # Setup instructions
├── 📄 API_DOCUMENTATION.md                      # API reference
├── 📄 INTEGRATION_SUMMARY.md                    # Integration overview
├── 📄 DIRECTORY_STRUCTURE.md                    # This file
│
│
├── 📂 backend/                                   # Express.js Backend Server
│   ├── 📄 server.js                              # Main server entry point
│   ├── 📄 package.json                           # Backend dependencies
│   ├── 📄 seed.js                                # Database seeding script
│   ├── 📄 tsconfig.json                          # TypeScript config (optional)
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                              # MongoDB connection handler
│   │
│   ├── 📂 models/
│   │   └── 📄 User.js                            # User schema definition
│   │                                              # - email (unique)
│   │                                              # - password (hashed)
│   │                                              # - firstName, lastName
│   │                                              # - role (employee|manager)
│   │                                              # - department, position
│   │                                              # - isActive, timestamps
│   │
│   ├── 📂 controllers/
│   │   └── 📄 authController.js                  # Authentication logic
│   │                                              # - register function
│   │                                              # - login function
│   │                                              # - getMe function
│   │
│   ├── 📂 routes/
│   │   └── 📄 auth.js                            # Auth API routes
│   │                                              # - POST /api/auth/register
│   │                                              # - POST /api/auth/login
│   │                                              # - GET /api/auth/me
│   │
│   └── 📂 middleware/
│       └── 📄 auth.js                            # JWT verification middleware
│                                                  # - auth: JWT token check
│                                                  # - requireRole: role check
│
│
├── 📂 frontend/                                  # React.js Frontend Application
│   ├── 📄 index.html                             # HTML entry point
│   ├── 📄 package.json                           # Frontend dependencies
│   ├── 📄 vite.config.js                         # Vite build config
│   ├── 📄 tailwind.config.js                     # Tailwind CSS config
│   ├── 📄 postcss.config.js                      # PostCSS config
│   ├── 📄 tsconfig.json                          # TypeScript config
│   ├── 📄 tsconfig.node.json                     # Node TypeScript config
│   ├── 📄 .env                                   # Frontend env variables
│   ├── 📄 .env.example                           # Example env file
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx                           # React app entry point
│       ├── 📄 App.jsx                            # Main router component
│       ├── 📄 index.css                          # Global styles
│       │
│       ├── 📂 context/
│       │   └── 📄 AuthContext.jsx                # Authentication state
│       │                                          # - useAuth hook
│       │                                          # - login function
│       │                                          # - register function
│       │                                          # - logout function
│       │                                          # - API communication
│       │
│       ├── 📂 components/
│       │   ├── 📄 PrivateRoute.jsx               # Protected route wrapper
│       │   │                                      # - Check authentication
│       │   │                                      # - Check role access
│       │   │                                      # - Handle redirects
│       │   │
│       │   ├── 📂 Auth/
│       │   │   └── 📄 Login.jsx                  # Login form component
│       │   │                                      # - Email input
│       │   │                                      # - Password input
│       │   │                                      # - Submit button
│       │   │                                      # - Error handling
│       │   │                                      # - Demo credentials info
│       │   │
│       │   └── 📂 Dashboards/
│       │       ├── 📄 EmployeeDashboard.jsx      # Employee dashboard
│       │       │                                  # - Task list
│       │       │                                  # - Productivity metrics
│       │       │                                  # - Weekly overview
│       │       │
│       │       └── 📄 ManagerDashboard.jsx       # Manager dashboard
│       │                                          # - Team performance
│       │                                          # - Employee metrics
│       │                                          # - Pending approvals
│       │
│       ├── 📂 services/
│       │   └── (Future API service files)
│       │
│       └── 📂 pages/
│           └── (Future page components)
│
│
└── 📂 node_modules/                              # Dependencies (generated)
    └── (all packages from package.json)

```

---

## 📊 File Statistics

| Area | Count | Files |
|------|-------|-------|
| **Backend** | 6 | server.js, db.js, User.js, authController.js, auth.js (routes & middleware), seed.js |
| **Frontend Components** | 4 | Login.jsx, EmployeeDashboard.jsx, ManagerDashboard.jsx, PrivateRoute.jsx |
| **Frontend Config** | 5 | vite.config.js, tailwind.config.js, postcss.config.js, tsconfig.json, .env |
| **Documentation** | 5 | README.md, SETUP_GUIDE.md, API_DOCUMENTATION.md, INTEGRATION_SUMMARY.md, DIRECTORY_STRUCTURE.md |
| **Total Core Files** | ~30 | Functions, components, routes, models, middleware |

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│   User Login    │
│   (Frontend)    │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│ POST /api/auth/login            │
│ {email, password}               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ authController.js               │
│ - Find user in DB               │
│ - Compare password              │
│ - Generate JWT                  │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ MongoDB User Document           │
│ - Email match                   │
│ - Password verification         │
└─────────────────────────────────┘
         │
         ├──→ Success → Token Generated
         │
         ├──→ Return: {token, user}
         │
         ↓
┌─────────────────────────────────┐
│ Frontend - Save Token           │
│ - localStorage.setItem          │
│ - Set Auth header               │
└────────┬────────────────────────┘
         │
         ↓
┌─────────────────────────────────┐
│ Role-Based Redirect             │
│ - role === "employee"           │
│   → /employee-dashboard         │
│ - role === "manager"            │
│   → /manager-dashboard          │
└─────────────────────────────────┘
```

---

## 🔐 Protected Route Flow

```
User requests: /employee-dashboard
         │
         ↓
┌──────────────────────────────┐
│ PrivateRoute Component       │
│ - Check isAuthenticated?     │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
  No        Yes
  ↓          ↓
Redirect   Check Role?
to Login       │
         ┌─────┴──────┐
         │            │
    Not Match      Match
         ↓            ↓
   Redirect      Render
   to other      Dashboard
   dashboard         │
              Employee sees
              their dashboard
```

---

## 📦 Dependencies Overview

### Backend (Node.js)
- **express** - Web framework
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT generation
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **express-validator** - Input validation
- **dotenv** - Environment variables

### Frontend (React)
- **react** - UI framework
- **react-dom** - React DOM
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **motion** - Animations
- **lucide-react** - Icons
- **vite** - Build tool

---

## 🎯 Key Integration Points

### 1. Authentication Flow
- Frontend: `context/AuthContext.jsx`
- Backend: `routes/auth.js` + `controllers/authController.js`
- Database: `models/User.js`

### 2. Protected Routes
- Frontend: `components/PrivateRoute.jsx`
- Backend: `middleware/auth.js`
- Validation: JWT token verification

### 3. Role-Based Access
- Stored in: `User.js` (role field: "employee" | "manager")
- Checked in: `PrivateRoute.jsx` + Backend middleware
- Redirects to appropriate dashboard

### 4. Dashboards
- Employee: `components/Dashboards/EmployeeDashboard.jsx`
- Manager: `components/Dashboards/ManagerDashboard.jsx`
- Auth context: `context/AuthContext.jsx` (provides user data)

---

## 🚀 Ready to Deploy

The application is organized in a deployment-ready structure:
- Backend can be deployed to Heroku, Railway, AWS, etc.
- Frontend can be deployed to Vercel, Netlify, AWS S3, etc.
- Database is on MongoDB Atlas (cloud-hosted)

See `SETUP_GUIDE.md` for deployment instructions.

