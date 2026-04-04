# DevGap AI — Career Decision Intelligence Platform

> A full-stack, production-grade career intelligence platform powered by AI-driven analysis of your GitHub, resume, and skill profile.

---

## 📁 Project Structure

```
DevGap-AI/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB
│   ├── config/        # Database connection
│   ├── middleware/    # Auth middleware (JWT)
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express API routes
│   ├── uploads/       # Uploaded files (resumes)
│   ├── server.js
│   └── package.json
│
├── .env               # Environment variables
├── docker-compose.yml # Docker setup
├── package.json       # Root — runs both with concurrently
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or provide a MongoDB Atlas URI
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/your-username/devgap-ai.git
cd devgap-ai
```

### 2. Configure environment variables
Edit the root `.env` and `backend/.env` files:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devgap
JWT_SECRET=your_super_secret_key
NODE_ENV=development
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Install all dependencies
```bash
# Install root devDependencies (concurrently)
npm install

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

Or use the shortcut:
```bash
npm run install:all
```

### 4. Run the development server
```bash
npm run dev
```

This starts:
- 🟢 **Backend** at `http://localhost:5000`
- 🔵 **Frontend** at `http://localhost:3000`

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/resume/upload` | Upload resume PDF |
| GET | `/api/resume` | Get parsed resume |
| POST | `/api/github/analyze` | Analyze GitHub profile |
| POST | `/api/career/analyze` | Run career decision engine |
| GET | `/api/career/trends` | Get market trends |
| GET | `/api/roadmap` | Get learning roadmap |
| GET | `/api/health` | Server health check |

---

## 🛠 Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Chart.js, React Router v7

**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT, Multer, bcryptjs

**DevOps:** Docker Compose, Concurrently (dev runner)
