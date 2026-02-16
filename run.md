# 🚀 How to Run the Project

This project consists of a **Backend (Node.js/Express)** and a **Frontend (React)**. Follow the steps below to get the application up and running.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- npm (comes with Node.js)

---

## 📂 Project Structure

- `/backend`: Node.js & Express server.
- `/client`: React frontend (Vite-based).
- `/frontend`: Alternative React frontend (CRA-based).

---

## 🏃‍♂️ Running the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the `backend` folder and add the following:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server:**
   ```bash
   node src/index.js
   ```
   *The server should now be running on `http://localhost:5000`.*

---

## 🎨 Running the Frontend (Client)

The `/client` directory contains the modern Vite-based React application.

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The frontend should now be running on `http://localhost:5173` (or the port shown in your terminal).*

---

## 📑 Running the Frontend (Alternative)

If you need to use the legacy React app in the `/frontend` directory:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the app:**
   ```bash
   npm start
   ```

---

## 📝 Notes
- Ensure your MongoDB service is running before starting the backend.
- If you encounter any port conflicts, you can change the ports in the respective `.env` or config files.
