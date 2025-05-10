# 📝 To-Do List App (Fullstack)

A fullstack To-Do list application built with **React**, **Express.js**, **MongoDB**, and **JWT-based authentication**. This app allows users to manage their personal tasks with secure login, token-based session management, and a responsive interface.

---

## 🚀 Features

### ✅ Authentication
- Signup and login with email/password
- Secure JWT authentication using access & refresh tokens
- Refresh token stored in HttpOnly cookie
- Token revocation and blacklist support on logout
- Protected API routes with middleware

### 🧾 To-Do Management
- Create, update, delete, and list your personal to-dos
- Each to-do has title, description, due date, and status
- Filter to-dos by status (pending, completed)
- Mark tasks as completed

### 💅 Frontend
- Built with **React + Tailwind CSS**
- Pages: Login, Signup, Dashboard
- API calls via Axios with credentials
- Token auto-refresh handling
- User-friendly UI with loading and error states

### 🛠️ Backend
- Built with **Express.js + TypeScript**
- MongoDB for database
- Models: `User` and `ToDo`
- Middleware for JWT auth and token revocation
- Password hashing with bcrypt
- Security practices using Helmet and CORS

---



### 📦 Backend

```bash
cd backend
npm install
npm install --save-dev ts-node-dev
npm run dev

```

### 📦 Frontend

```bash
cd frontend
npm install
npm run dev

```



