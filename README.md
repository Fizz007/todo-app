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

```

### Screenshot 1
![Screenshot 1](![Screenshot 2025-05-14 130116](https://github.com/user-attachments/assets/a9146ad3-aed3-4970-a708-de3899fa41d9)
)

### Screenshot 2
![Screenshot 2](![Screenshot 2025-05-14 130159](https://github.com/user-attachments/assets/2dcd8bad-446a-4c66-8db0-e9f3f5891ea1)
)

### Screenshot 3
![Screenshot 3](![Screenshot 2025-05-14 130225](https://github.com/user-attachments/assets/af85af51-541d-4fd6-bddd-4833b8dff38f)
)


```



