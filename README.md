# ⚡ API Playground for Non-Technical Teams

A full MERN stack SaaS application that lets teams save, manage, and test API endpoints — no technical knowledge required.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone & Install

```bash
# Install root dependencies
npm install

# Install all (server + client) at once
npm run install:all
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/api-playground
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/api-playground
```

### 3. Run the App

```bash
# Run both server and client simultaneously (from root)
npm run dev
```

Or separately:
```bash
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 3000)
cd client && npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
api-playground/
├── package.json              ← Root (run both with concurrently)
│
├── server/                   ← Node.js + Express backend
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── models/
│   │   ├── User.js           ← User schema + bcrypt hooks
│   │   └── Endpoint.js       ← API endpoint schema
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect middleware
│   ├── routes/
│   │   ├── auth.js           ← /api/auth (register, login, me)
│   │   └── api.js            ← /api/endpoints (CRUD + test proxy)
│   ├── server.js             ← Express app entry point
│   ├── .env                  ← Environment variables (edit this!)
│   └── package.json
│
└── client/                   ← React frontend
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        ├── components/
        │   ├── APIForm.jsx       ← Add new endpoint form
        │   ├── APIList.jsx       ← Saved endpoints sidebar
        │   └── ResponseViewer.jsx← JSON response display
        ├── services/
        │   └── api.js            ← Axios instance + all API calls
        ├── App.js                ← Routes + auth guards
        ├── index.js
        └── index.css             ← Full design system
```

---

## 🔑 Features

| Feature | Details |
|---|---|
| **Authentication** | Register & login with bcrypt-hashed passwords |
| **JWT Auth** | Token stored in localStorage, auto-attached to all requests |
| **Protected Routes** | Frontend & backend both guard private resources |
| **Endpoint Management** | Save name, URL, HTTP method, headers, request body |
| **API Testing** | Backend proxy sends request via axios — avoids CORS issues |
| **Error Handling** | Friendly messages for ENOTFOUND, ETIMEDOUT, ECONNREFUSED |
| **Response Viewer** | Syntax-highlighted JSON with status code + duration |
| **Copy Response** | One-click copy to clipboard |

---

## 🌐 API Endpoints (Backend)

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Endpoints (all protected)
| Method | Route | Description |
|---|---|---|
| GET | `/api/endpoints` | List user's endpoints |
| POST | `/api/endpoints` | Create endpoint |
| DELETE | `/api/endpoints/:id` | Delete endpoint |
| POST | `/api/endpoints/:id/test` | Proxy-test the endpoint |

---

## 🔧 Tech Stack

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **HTTP Proxy**: Axios on the server (bypasses browser CORS)
- **Dev Tools**: nodemon, concurrently
