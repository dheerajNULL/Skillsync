# SkillSync – Intelligent Career Roadmap Web-App

> AI-powered career recommendation platform that helps students discover their ideal career path through skill assessment and ML-based matching.

![SkillSync](https://img.shields.io/badge/SkillSync-Career_Intelligence-4F46E5?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

## 🚀 Features

- **ML-Powered Career Recommendations** – Weighted scoring algorithm matching skills to 8+ career profiles
- **Multi-Step Skill Assessment** – Interactive 3-step form for technical skills, soft skills, and interests
- **Visual Dashboard** – Chart.js analytics with skill distribution and career match visualizations
- **JWT Authentication** – Secure signup/login with bcrypt password hashing
- **Progress Tracking** – Save and compare prediction history over time
- **Learning Roadmaps** – Step-by-step career development paths
- **Responsive Design** – Glassmorphism UI that works on all devices

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Auth | JWT, bcrypt.js |
| ML Engine | Custom Weighted Scoring Algorithm |

## 📁 Folder Structure

```
SkillSync/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Signup/Login logic
│   │   ├── skillsController.js # Skills CRUD
│   │   └── resultsController.js# Results CRUD
│   ├── middleware/
│   │   └── verifyToken.js      # JWT authentication
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Skills.js           # Skills schema
│   │   └── Results.js          # Results schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── skillsRoutes.js     # Skills endpoints
│   │   ├── resultsRoutes.js    # Results endpoints
│   │   └── mlRoutes.js         # ML prediction endpoint
│   ├── services/
│   │   └── recommendationEngine.js  # ML algorithm
│   ├── server.js               # Express server
│   ├── .env                    # Environment variables
│   └── package.json
├── frontend/
│   ├── css/
│   │   ├── style.css           # Global design system
│   │   ├── landing.css         # Landing page styles
│   │   ├── auth.css            # Auth page styles
│   │   ├── assessment.css      # Assessment form styles
│   │   └── dashboard.css       # Dashboard styles
│   ├── js/
│   │   ├── api.js              # API wrapper & utilities
│   │   ├── app.js              # Landing page logic
│   │   ├── auth.js             # Auth logic
│   │   ├── assessment.js       # Assessment form logic
│   │   └── dashboard.js        # Dashboard & Chart.js
│   ├── pages/
│   │   ├── auth.html           # Login/Signup page
│   │   └── assessment.html     # Multi-step assessment
│   ├── index.html              # Landing page
│   └── dashboard.html          # Dashboard page
└── README.md
```

## ⚡ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB Atlas** account (free tier works)
- **npm** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skillsync.git
cd skillsync
```

### 2. Setup Backend

```bash
cd SkillSync/backend
npm install
```

### 3. Configure Environment Variables

Edit the `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/skillsync?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

> ⚠️ Replace `MONGO_URI` with your actual MongoDB Atlas connection string.

### 4. Start the Backend

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Open the Frontend

Open `frontend/index.html` in your browser, or use a local server:

```bash
# Using Python
cd ../frontend
python3 -m http.server 3000

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

## 📡 API Documentation

### Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Skills Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/skills/add` | Add/update skills | ✅ |
| GET | `/api/skills/:userId` | Get user skills | ✅ |

### Results Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/results/save` | Save prediction | ✅ |
| GET | `/api/results/history/:userId` | Get history | ✅ |

### ML Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ml/predict` | Get career predictions | ✅ |

### Example Request

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Get Predictions
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"technical_skills":["JavaScript","React"],"soft_skills":["Communication"],"interest_level":"Web Development"}'
```

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication with expiration
- Protected API routes with middleware
- Input validation on all endpoints
- CORS configuration
- Secure error handling (no stack traces in production)

## 🚀 Deployment

### Frontend → Netlify / Vercel
1. Push to GitHub
2. Connect to Netlify/Vercel
3. Set build directory to `frontend/`

### Backend → Render / Railway
1. Push to GitHub
2. Create new web service
3. Set environment variables
4. Set start command: `node server.js`

### Database → MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add database user
3. Whitelist IP addresses
4. Copy connection string to `.env`

## 🔮 Future Enhancements

- 📄 Resume Analyzer – Upload resume for skill extraction
- 🤖 AI Chatbot Mentor – Career guidance chatbot
- 🔗 LinkedIn Integration – Import skills from LinkedIn
- 📈 Real-time Career Trends – Labor market data integration
- 📊 Skill Gap Analysis – Identify missing skills for target roles
- 🏆 Certificate Recommendations – Suggested certifications
- 🌙 Dark Mode Toggle
- 📧 Email Verification & Password Reset
- 👤 Admin Dashboard
- 📋 Export Results as PDF

## 📝 License

This project is licensed under the ISC License.

---

Built with ❤️ by SkillSync Team
