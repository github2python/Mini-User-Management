# Quick Start Guide

This guide will help you get the User Management System up and running quickly.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Backend

```bash
cd backend

# Copy environment file
cp env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/user-management
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/user-management
```

### 3. Setup Frontend

```bash
cd frontend

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Create Admin User (Optional)

```bash
cd backend
npm run seed:admin
```

This creates an admin user:
- Email: `admin@example.com`
- Password: `Admin1234`

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs (Swagger): http://localhost:5000/api-docs

## First Steps

1. **Sign up** a new user account at http://localhost:3000/signup
2. **Login** with your credentials
3. If you created an admin user, login with `admin@example.com` / `Admin1234` to access the admin dashboard

## Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test with Postman

1. Import `backend/postman_collection.json` into Postman
2. Set `baseUrl` variable to `http://localhost:5000`
3. Start with "Signup" or "Login" request
4. Token will be automatically saved for authenticated requests

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Common Issues

### MongoDB Connection Error

- Ensure MongoDB is running locally, or
- Update `MONGODB_URI` in backend `.env` with correct connection string

### Port Already in Use

- Backend: Change `PORT` in backend `.env`
- Frontend: React will prompt to use a different port

### CORS Errors

- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default: `http://localhost:3000`

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API documentation at http://localhost:5000/api-docs
- Check out the test files in `backend/tests/` for examples

## Need Help?

- Check the main README.md for detailed documentation
- Review API documentation at `/api-docs` endpoint
- Check test files for usage examples

