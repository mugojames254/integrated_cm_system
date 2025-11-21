# 🏗️ Construction Management System - Quick Start Guide

## Overview
This is a complete, production-ready construction management system with:
- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + React Router + Axios
- **Authentication**: JWT with role-based access (Admin/Employee)

## ⚡ Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd /root/course_work/smart_facility_mgt/code_env/constructionManagementSystem/integrated_cm_system
npm install
cd client && npm install && cd ..
```

### 2. Start the Application
```bash
# Option A: Run both servers together (recommended)
npm run dev

# Option B: Run separately
# Terminal 1: npm run server
# Terminal 2: npm run client
```

### 3. Login
- Open browser to `http://localhost:3000`
- **Admin**: username: `admin`, password: `admin123`
- **Employee**: username: `john_doe`, password: `employee123`

## 📦 What's Included

### ✅ Backend Features
- RESTful API with Express.js
- SQLite database with sample data
- JWT authentication & authorization
- Role-based access control
- Input validation
- 6 API route modules:
  - `/api/auth` - Registration & Login
  - `/api/projects` - Project CRUD
  - `/api/tasks` - Task CRUD
  - `/api/resources` - Resource CRUD
  - `/api/employees` - Employee management (Admin only)
  - `/api/users` - User profile & password management

### ✅ Frontend Features
- Modern React application with hooks
- React Router for navigation
- Context API for authentication state
- 8 responsive pages:
  1. **Login** - User authentication
  2. **Register** - New user registration
  3. **Dashboard** - Overview with stats
  4. **Projects** - Project management
  5. **Project Detail** - Tasks & resources per project
  6. **Resources** - Material & machinery inventory
  7. **Employees** - Employee management (Admin only)
  8. **Profile** - User settings

### ✅ Sample Data Included
- 1 Admin user
- 2 Employee users
- 3 Projects (Office Complex, Bridge Renovation, Residential Community)
- 5 Tasks assigned to projects
- 6 Resources (cement, steel, cranes, concrete mixers, etc.)

## 🎯 Key Functionalities

### For Admins:
- Manage all projects, tasks, and resources
- Add/remove employees
- Assign tasks to team members
- View system-wide statistics

### For Employees:
- View assigned projects and tasks
- Track task progress
- View resource availability
- Update personal profile

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│  (Dashboard, Projects, Tasks, Resources, Profile)   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────┐
│              Express.js Backend                      │
│  (Auth, Projects, Tasks, Resources, Employees)      │
└────────────────────┬────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────────┐
│              SQLite Database                         │
│  (users, projects, tasks, resources)                │
└─────────────────────────────────────────────────────┘
```

## 📊 Project Status Types

### Projects
- Planning
- In Progress
- On Hold
- Completed
- Cancelled

### Tasks
- Pending
- In Progress
- Completed
- Blocked

### Resources
- Available
- In Use
- Under Maintenance
- Unavailable

## 🔐 Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 24-hour expiration
- Protected routes with authentication middleware
- Role-based authorization (Admin/Employee)

## 📁 File Structure Summary

```
integrated_cm_system/
├── server/                   # Backend
│   ├── database/init.js     # DB schema & sample data
│   ├── middleware/auth.js   # JWT authentication
│   ├── routes/              # API endpoints
│   └── index.js             # Server entry point
├── client/                   # Frontend
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # Auth context
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── App.js           # Main app
├── package.json             # Backend deps
├── .env                     # Environment config
└── README.md                # Full documentation
```

## 🚀 Next Steps

1. **Customize**: Update branding, colors, and features
2. **Deploy**: Follow deployment tips in README.md
3. **Secure**: Change JWT_SECRET in production
4. **Extend**: Add reporting, notifications, file uploads, etc.

## 💡 Tips

- The database auto-creates on first run
- All API routes require authentication except login/register
- Admin-only routes return 403 for non-admin users
- Frontend proxy configured for seamless API calls

## 🆘 Need Help?

Check the full README.md for:
- Detailed API documentation
- Troubleshooting guide
- Deployment instructions
- Environment configuration

---

**The system is ready to run!** Just install dependencies and start the servers. 🎉
