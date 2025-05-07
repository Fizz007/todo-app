# Todo List Backend

A RESTful API backend for a Todo List application built with Express.js, TypeScript, and MongoDB.

## Features

- JWT-based authentication with refresh tokens
- CRUD operations for todos
- Secure password hashing
- CORS enabled with credentials
- Helmet security headers
- TypeScript support
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   COOKIE_SECRET=your_cookie_secret
   CLIENT_URL=http://localhost:3000
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

- `POST /api/auth/logout` - Logout user
  - Requires Authorization header with Bearer token

- `POST /api/auth/refresh-token` - Get new access token
  - Requires refresh token in HttpOnly cookie

### Todos

All todo endpoints require Authorization header with Bearer token

- `GET /api/todos` - Get all todos for the logged-in user
- `POST /api/todos` - Create a new todo
  - Body: `{ "title": "Todo title", "description": "Todo description", "dueDate": "2024-03-20" }`
- `PUT /api/todos/:id` - Update a todo
  - Body: `{ "title": "Updated title", "description": "Updated description", "status": "completed" }`
- `DELETE /api/todos/:id` - Delete a todo

## Security Features

- JWT-based authentication
- Refresh token rotation
- Password hashing with bcrypt
- Secure HTTP headers with Helmet
- CORS with credentials
- HttpOnly cookies for refresh tokens

## Error Handling

The API uses centralized error handling and returns appropriate HTTP status codes with error messages in the response body.

## Development

The project uses TypeScript for type safety and better development experience. The development server includes hot-reloading for faster development.

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment variables
2. Update CORS settings with your production client URL
3. Use strong secrets for JWT and cookies
4. Enable HTTPS
5. Set appropriate cookie settings for your domain 