# Construction Management System

A full-stack construction management system built with **Node.js**, **Express**, **React**, and **SQLite**. This application provides comprehensive project management, task tracking, resource allocation, and employee management features for construction businesses.

## 🚀 Features

### Core Functionality

- **User Authentication**
  - Secure registration and login system
  - JWT-based authentication
  - Role-based access control (Admin & Employee)

- **Project Management**
  - Create, read, update, and delete projects
  - Track project status (Planning, In Progress, On Hold, Completed, Cancelled)
  - View project timelines and details

- **Task Management**
  - Create and assign tasks within projects
  - Set due dates, priorities, and status
  - Track task progress (Pending, In Progress, Completed, Blocked)
  - Filter tasks by project or assigned employee

- **Resource Management**
  - Manage materials (cement, steel, etc.) and machinery (crane, forklift, etc.)
  - Track inventory quantities for materials
  - Monitor machinery availability status
  - Allocate resources to specific projects

- **Employee Management (Admin-only)**
  - View all employees
  - Add, edit, and remove employee profiles
  - Assign tasks to employees

- **User Profile**
  - View and edit personal information
  - Change password

### User Roles

- **Admin**: Full access to all features including employee management
- **Employee**: Access to projects, tasks, resources, and personal profile

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## 🛠️ Installation

### 1. Clone or Navigate to the Project Directory

```bash
cd /root/course_work/smart_facility_mgt/code_env/constructionManagementSystem/integrated_cm_system
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Start the Backend Server

```bash
npm run server
```

The backend server will start on `http://localhost:5000`

#### Terminal 2 - Start the Frontend Development Server

```bash
npm run client
```

The React frontend will start on `http://localhost:3000`

### Option 2: Run Both Concurrently (Recommended for Development)

```bash
npm run dev
```

This will start both the backend and frontend servers simultaneously.

### Option 3: Production Build

```bash
# Build the React frontend
npm run build

# Start the production server
npm start
```

The application will be available at `http://localhost:5000`

## 🔐 Demo Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Employee Accounts
- **Username**: `john_doe`
- **Password**: `employee123`

Or

- **Username**: `jane_smith`
- **Password**: `employee123`

## 📁 Project Structure

```
integrated_cm_system/
├── server/                      # Backend (Node.js + Express)
│   ├── database/
│   │   └── init.js             # Database initialization and schema
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── projects.js         # Project management routes
│   │   ├── tasks.js            # Task management routes
│   │   ├── resources.js        # Resource management routes
│   │   ├── employees.js        # Employee management routes
│   │   └── users.js            # User profile routes
│   └── index.js                # Server entry point
├── client/                      # Frontend (React)
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Layout.js       # Main layout with navigation
│       │   └── Layout.css
│       ├── context/
│       │   └── AuthContext.js  # Authentication context
│       ├── pages/
│       │   ├── Login.js        # Login page
│       │   ├── Register.js     # Registration page
│       │   ├── Dashboard.js    # Dashboard with overview
│       │   ├── Projects.js     # Projects list
│       │   ├── ProjectDetail.js # Single project view
│       │   ├── Resources.js    # Resources management
│       │   ├── Employees.js    # Employee management (Admin)
│       │   └── Profile.js      # User profile
│       ├── services/
│       │   └── api.js          # API service layer
│       ├── App.js              # Main app component
│       ├── App.css             # Global styles
│       └── index.js            # React entry point
├── package.json                # Backend dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🗄️ Database

The application uses **SQLite** for data persistence. The database file (`construction_management.db`) is automatically created in the `server/database/` directory when you first run the application.

### Database Schema

- **users**: User accounts with authentication details
- **projects**: Construction projects
- **tasks**: Tasks associated with projects
- **resources**: Materials and machinery inventory

### Sample Data

The database is pre-populated with sample data including:
- 1 Admin user and 2 Employee users
- 3 sample projects
- 5 sample tasks
- 6 sample resources (materials and machinery)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks (filter by project_id)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Employees (Admin only)
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (for dropdowns)

## 🎨 Features by Page

### Dashboard
- Overview statistics (total projects, active projects, total tasks, pending tasks)
- Recent projects list
- Recent/assigned tasks list

### Projects Page
- Grid view of all projects
- Create new projects
- Delete projects
- View project details

### Project Detail Page
- Complete project information
- Task management (create, update status, delete)
- View allocated resources
- Assign tasks to employees

### Resources Page
- Filterable list (All, Materials, Machinery)
- Create new resources
- Track quantities and availability
- Assign resources to projects

### Employees Page (Admin only)
- List of all employees
- Add new employees
- Delete employees

### Profile Page
- View user information
- Update profile details
- Change password

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected API routes with middleware
- Role-based access control
- Input validation on all forms

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management

## 📝 Environment Variables

The `.env` file contains the following configuration:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

⚠️ **Important**: Change the `JWT_SECRET` to a strong, unique value in production!

## 🚀 Deployment Tips

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env` with a secure random string
2. **Build Frontend**: Run `npm run build` to create production build
3. **Set NODE_ENV**: Change `NODE_ENV=production` in `.env`
4. **Database Backup**: Regularly backup the SQLite database file
5. **Use Process Manager**: Use PM2 or similar to keep the server running

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, change the PORT in `.env` or the React proxy settings.

### Database Errors
Delete the `construction_management.db` file and restart the server to recreate the database with fresh sample data.

### Module Not Found
Ensure all dependencies are installed:
```bash
npm install
cd client && npm install
```

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Created as a demonstration of full-stack development with Node.js, Express, React, and SQLite.

---

**Happy Building! 🏗️**
