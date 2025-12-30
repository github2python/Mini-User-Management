# User Management System

A full-stack web application for managing user accounts with role-based access control (RBAC), built with Node.js, Express, MongoDB, and React.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Docker Setup](#docker-setup)
- [CI/CD](#cicd)

## 🎯 Overview

This User Management System provides a complete solution for user authentication, authorization, and management. It supports:

- User registration and authentication
- Role-based access control (Admin/User)
- User profile management
- Admin dashboard for user administration
- **Task Management System with AI-powered features**
- Secure password handling with bcrypt
- JWT-based authentication

## ✨ Features

### Authentication
- User signup with email validation and password strength requirements
- User login with credential verification
- JWT token-based authentication
- Secure logout functionality
- Current user information endpoint

### User Management (Admin)
- View all users with pagination (10 users per page)
- Activate user accounts
- Deactivate user accounts
- Prevent self-deactivation

### User Management (User)
- View own profile
- Update full name and email
- Change password with validation

### Security
- Password hashing using bcrypt
- Protected routes with authentication middleware
- Role-based access control
- Input validation on all endpoints
- Consistent error response format
- Proper HTTP status codes
- Environment variables for sensitive data

### Task Management System
- **Create, Edit, and Delete Tasks** - Full CRUD operations for task management
- **AI-Powered Features**:
  - Automatic summary generation from task content
  - Intelligent tag generation based on keywords and context
  - Manual AI regeneration for summaries and tags
- **Advanced Filtering & Search**:
  - Real-time search across titles, descriptions, summaries, and tags
  - Filter by status (pending, in-progress, completed, cancelled)
  - Filter by priority (low, medium, high, urgent)
  - Filter by tags
  - Debounced search for better performance
- **Task Features**:
  - Status tracking with visual badges
  - Priority levels with color coding
  - Due date management
  - Task assignment (Admin can assign to users)
  - Creator visibility (Admins can see who created each task)
- **Role-Based Access**:
  - Users can create and manage their own tasks
  - Admins can view all tasks and assign them to users
  - Task permissions based on creator/assignee

### Frontend Features
- Responsive design (desktop & mobile)
- Modern UI with toast notifications
- Loading states and error handling
- Protected routes
- Role-based navigation
- Form validation (client & server-side)
- Real-time state management with React Context
- Debounced search inputs for better UX

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Swagger** - API documentation

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertions

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── tasks.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── aiSimulator.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── admin.test.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Modal.js
│   │   │   ├── Navbar.js
│   │   │   ├── Toast.js
│   │   │   ├── ToastContainer.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   └── Tasks.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── hooks/
│   │   │   └── useToast.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp env.example .env
```

4. Update the `.env` file with your configuration (see [Environment Variables](#environment-variables))

5. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Important:** Never commit `.env` files to version control. They are already included in `.gitignore`.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active"
  }
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active"
  }
}
```

#### GET /api/auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/logout
Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <token>
```

### User Endpoints

#### GET /api/users/profile
Get user profile.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "fullName": "Jane Doe"
}
```

#### PUT /api/users/change-password
Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

### Admin Endpoints

#### GET /api/admin/users
Get all users with pagination (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "users": [...]
}
```

#### PUT /api/admin/users/:id/activate
Activate a user account (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/admin/users/:id/deactivate
Deactivate a user account (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

### Task Management Endpoints

#### GET /api/tasks
Get all tasks with filtering and search.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status: pending, in-progress, completed, cancelled
- `priority` (optional) - Filter by priority: low, medium, high, urgent
- `search` (optional) - Search in title, description, summary, and tags
- `tag` (optional) - Filter by specific tag
- `assignedTo` (optional) - Filter by assigned user ID

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "tasks": [...]
}
```

#### POST /api/tasks
Create a new task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "User cannot login with correct credentials",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31",
  "assignedTo": "user-id-here"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "task-id",
    "title": "Fix login bug",
    "summary": "AI-generated summary...",
    "tags": ["bug-fix", "urgent"],
    ...
  }
}
```

#### GET /api/tasks/:id
Get a single task by ID.

**Headers:**
```
Authorization: Bearer <token>
```

#### PUT /api/tasks/:id
Update a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "in-progress",
  "priority": "urgent"
}
```

#### DELETE /api/tasks/:id
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST /api/tasks/:id/regenerate-ai
Regenerate AI summary and tags for a task.

**Headers:**
```
Authorization: Bearer <token>
```

### Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:5000/api-docs
```

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage

The project includes:
- Unit tests for authentication
- Integration tests for admin functions
- Minimum 5 test cases as required

## 🐳 Docker Setup

### Using Docker Compose

1. Build and start all services:
```bash
docker-compose up -d
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

3. Stop all services:
```bash
docker-compose down
```

4. Stop and remove volumes:
```bash
docker-compose down -v
```

### Individual Docker Commands

#### Backend
```bash
cd backend
docker build -t user-management-backend .
docker run -p 5000:5000 --env-file .env user-management-backend
```

#### Frontend
```bash
cd frontend
docker build -t user-management-frontend .
docker run -p 3000:80 user-management-frontend
```

## 🌐 Deployment Links

### Live Application URLs

**Frontend (Vercel):**
```
https://mini-user-management-seven.vercel.app
```

**Backend API (Render):**
```
https://mini-user-management-oig7.onrender.com
```

**API Documentation (Swagger):**
```
https://mini-user-management-oig7.onrender.com/api-docs
```

**Database:**
```
MongoDB Atlas (Cloud-hosted)
```

---

### Step 1: Database Deployment (MongoDB Atlas)

**Why MongoDB Atlas?**
- Free tier available (512MB storage)
- Automatic backups
- Global clusters
- Easy connection string management

**Instructions:**

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region (choose closest to your backend)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add specific IPs for production
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `user-management`
   - Example: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/user-management?retryWrites=true&w=majority`

---

### Step 2: Backend Deployment (Render)

**Why Render?**
- Free tier available
- Automatic deployments from GitHub
- Built-in SSL certificates
- Environment variable management

**Instructions:**

1. **Prepare GitHub Repository**
   ```bash
   # Make sure your code is committed and pushed to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended for easy integration)

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

4. **Configure Backend Service**
   - **Name:** `user-management-backend` (or your choice)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if needed)

5. **Add Environment Variables**
   Click "Environment" and add:
   ```
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
   **Important:** 
   - Use a strong JWT_SECRET (at least 32 characters)
   - Replace `your-mongodb-atlas-connection-string` with your Atlas connection string
   - Replace `your-frontend-url.vercel.app` with your actual frontend URL (you'll update this after frontend deployment)

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait for deployment to complete (usually 2-5 minutes)
   - Copy your service URL (e.g., `https://user-management-backend.onrender.com`)

7. **Update Frontend URL in Environment Variables**
   - After deploying frontend, come back to Render
   - Update `FRONTEND_URL` with your actual frontend URL

---

### Step 3: Frontend Deployment (Vercel)

**Why Vercel?**
- Optimized for React applications
- Automatic deployments from GitHub
- Free SSL certificates
- Global CDN
- Preview deployments for pull requests

**Instructions:**

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Frontend Project**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace `your-backend-url.onrender.com` with your actual Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-3 minutes)
   - Vercel will provide you with a URL (e.g., `https://user-management-frontend.vercel.app`)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

5. **Production Deployment:**
   ```bash
   vercel --prod
   ```

---

### Step 4: Update Deployment Links

After deployment, update the [Deployment Links](#-deployment-links) section in this README with your actual URLs.

---

### Step 5: Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try to sign up and login
   - Test all features

3. **Test API Documentation:**
   - Visit: `https://your-backend-url.onrender.com/api-docs`
   - Should show Swagger UI

---

### Troubleshooting Deployment

**Backend Issues:**
- **Build fails:** Check build logs in Render dashboard
- **Database connection fails:** Verify MongoDB Atlas connection string and network access
- **CORS errors:** Ensure `FRONTEND_URL` in backend matches your frontend URL exactly

**Frontend Issues:**
- **API calls fail:** Verify `REACT_APP_API_URL` is set correctly
- **Build fails:** Check build logs in Vercel dashboard
- **Blank page:** Check browser console for errors

**Common Solutions:**
- Clear browser cache
- Check environment variables are set correctly
- Verify CORS settings in backend
- Check MongoDB Atlas network access allows your Render IP

## 🔄 CI/CD Pipeline

This project includes a complete CI/CD (Continuous Integration/Continuous Deployment) pipeline using GitHub Actions.

### What is CI/CD?

**CI (Continuous Integration):** Automatically tests and validates code changes whenever code is pushed to the repository.

**CD (Continuous Deployment):** Automatically deploys code to production after successful tests (optional, not configured in this project).

### How Our CI/CD Pipeline Works

The pipeline is configured in `.github/workflows/ci.yml` and automatically runs when:

1. **Code is pushed** to `main`, `master`, or `develop` branches
2. **Pull requests** are created targeting `main`, `master`, or `develop` branches

### Pipeline Stages

Our CI/CD pipeline consists of three main jobs that run in parallel:

#### 1. Backend Testing Job
```yaml
- Sets up Node.js environment
- Starts MongoDB service (for testing)
- Installs backend dependencies
- Runs all backend tests
- Generates test coverage reports
```

**What it does:**
- Ensures all backend code works correctly
- Validates API endpoints
- Checks authentication and authorization
- Verifies database operations

**If tests fail:** The pipeline stops and you'll be notified via GitHub

#### 2. Frontend Build Job
```yaml
- Sets up Node.js environment
- Installs frontend dependencies
- Builds the React application
- Checks for build errors
```

**What it does:**
- Ensures frontend code compiles without errors
- Validates React components
- Checks for missing dependencies
- Verifies build configuration

**If build fails:** The pipeline stops and you'll be notified

#### 3. Linting Job
```yaml
- Sets up Node.js environment
- Installs dependencies for both frontend and backend
- Runs ESLint checks
- Validates code style
```

**What it does:**
- Ensures code follows style guidelines
- Checks for common errors
- Validates code quality

### Viewing CI/CD Results

1. **On GitHub:**
   - Go to your repository
   - Click "Actions" tab
   - See all workflow runs
   - Click on any run to see detailed logs

2. **Status Badge:**
   - Green checkmark ✅ = All tests passed
   - Red X ❌ = Tests failed (click to see details)

### Benefits of CI/CD

✅ **Early Error Detection:** Catch bugs before they reach production  
✅ **Code Quality:** Ensures consistent code standards  
✅ **Automated Testing:** No need to manually run tests  
✅ **Confidence:** Know your code works before merging  
✅ **Team Collaboration:** Everyone sees test results  

---

## 📦 Repository Structure & Best Practices

### 1. Single GitHub Repository Structure

This project follows the **monorepo** pattern, where both frontend and backend code live in a single repository but are organized into separate folders.

**Why this structure?**
- ✅ Easier to manage related code together
- ✅ Single source of truth
- ✅ Shared configuration files
- ✅ Easier CI/CD setup
- ✅ Better version control

**Our Structure:**
```
assignment/                    # Root repository
├── backend/                   # Backend code (Node.js/Express)
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── utils/                # Utility functions
│   ├── tests/                # Test files
│   ├── server.js             # Entry point
│   └── package.json          # Backend dependencies
│
├── frontend/                  # Frontend code (React)
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── utils/            # Utility functions
│   │   └── App.js            # Main app component
│   └── package.json          # Frontend dependencies
│
├── .github/
│   └── workflows/
│       └── ci.yml            # CI/CD configuration
│
├── docker-compose.yml         # Docker configuration
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

**How to maintain this structure:**
- Keep backend code in `/backend` folder
- Keep frontend code in `/frontend` folder
- Don't mix backend and frontend files
- Use separate `package.json` files for each

---

### 3. CI/CD Pipeline Configuration

Our CI/CD pipeline is configured in `.github/workflows/ci.yml`.

#### How to Set Up CI/CD:

**Step 1: Create Workflow File**
- Create `.github/workflows/` directory in your repository root
- Create `ci.yml` file (already done in this project)

**Step 2: Configure Workflow**
The workflow file defines:
- **When to run:** On push/PR to specific branches
- **What to run:** Tests, builds, linting
- **Environment:** Node.js version, services needed

**Step 3: Push to GitHub**
```bash
git add .github/workflows/ci.yml
git commit -m "chore: add CI/CD pipeline configuration"
git push origin main
```

**Step 4: GitHub Actions Automatically Activates**
- GitHub detects the workflow file
- Runs automatically on every push/PR
- Results appear in "Actions" tab

#### Understanding the CI/CD Workflow File:

```yaml
name: CI/CD Pipeline              # Workflow name

on:                               # When to trigger
  push:                           # On code push
    branches: [ main, master ]    # To these branches
  pull_request:                   # On pull requests
    branches: [ main, master ]    # Targeting these branches

jobs:                             # Jobs to run
  backend-test:                   # Job 1: Test backend
    runs-on: ubuntu-latest        # Run on Ubuntu
    steps:                         # Steps to execute
      - uses: actions/checkout@v3 # Checkout code
      - uses: actions/setup-node@v3 # Setup Node.js
      - run: npm install          # Install dependencies
      - run: npm test            # Run tests
```

#### What Happens When You Push Code:

1. **GitHub receives your push**
2. **GitHub Actions detects the workflow**
3. **Starts a virtual machine (Ubuntu)**
4. **Checks out your code**
5. **Sets up Node.js environment**
6. **Runs your tests/builds**
7. **Reports results back to GitHub**
8. **Shows status in your repository**

#### CI/CD Status Indicators:

- ✅ **Green checkmark:** All tests passed
- ❌ **Red X:** Tests failed (click to see details)
- 🟡 **Yellow circle:** Tests are running
- ⚪ **Gray circle:** Tests are queued

#### Viewing CI/CD Results:

1. Go to your GitHub repository
2. Click "Actions" tab
3. See list of all workflow runs
4. Click on any run to see:
   - Which jobs ran
   - Test results
   - Build logs
   - Error messages (if any)

---

## 📝 Database Schema

### User Collection

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String (required),
  role: String (enum: ['admin', 'user'], default: 'user'),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task Collection

```javascript
{
  title: String (required, min: 3),
  description: String,
  summary: String (AI-generated),
  tags: [String] (AI-generated),
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending'),
  priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  dueDate: Date,
  createdBy: ObjectId (ref: 'User', required),
  assignedTo: ObjectId (ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (7 days default)
- Protected routes with authentication middleware
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data
- No password in API responses

## 🎨 UI Components

- **Button** - Primary, secondary, danger, success, outline variants
- **Input** - Form inputs with validation
- **Modal** - Confirmation dialogs
- **Toast** - Success, error, info, warning notifications
- **LoadingSpinner** - Loading states
- **Navbar** - Navigation with user info

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for assessment purposes.

## 🎯 Future Enhancements

- Email verification
- Password reset functionality
- Two-factor authentication
- User activity logs
- Export user data
- Bulk user operations
- Rate limiting
- API rate limiting
- Caching layer (Redis)
- Real-time task notifications
- Task comments and attachments
- Task time tracking
- Advanced task analytics
- Integration with external AI services (OpenAI, etc.)

---
