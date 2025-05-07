# TaskMasterPro

A modern to-do list application with authentication, built using Express.js, TypeScript, MongoDB, and React.

## Features

- RESTful API backend
- JWT authentication with refresh tokens
- Secure user management
- Complete to-do CRUD operations
- Modern React frontend

## Technology Stack

### Backend
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Zod for validation
- Bcrypt for password hashing

### Frontend
- React
- TypeScript
- TailwindCSS
- React Query for API calls

## API Endpoints

### Authentication
- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – Authenticate user and return tokens
- `POST /api/auth/logout` – Revoke refresh token and clear cookie
- `POST /api/auth/refresh-token` – Issue new access token using refresh token

### Todo Management
- `GET /api/todos` – Get all to-dos for the logged-in user
- `POST /api/todos` – Create a new to-do
- `PUT /api/todos/:id` – Update an existing to-do
- `DELETE /api/todos/:id` – Delete a to-do

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmaster
ACCESS_TOKEN_SECRET=your_secure_secret_here
REFRESH_TOKEN_SECRET=another_secure_secret_here
```

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### Railway / Render
This application is configured to be easily deployed to Railway or Render:

1. Connect your repository to Railway/Render
2. Set the environment variables
3. Deploy the application

### Production Considerations
- Set `NODE_ENV=production`
- Configure a secure domain for cookies
- Use strong, unique secrets for JWT tokens

## License

MIT 