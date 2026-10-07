import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import bcrypt from 'bcrypt';
// import Skill from './models/Skill.js';
import authRouter from './routes/authRoutes.js';
import skillRouter from './routes/skillRoutes.js';

mongoose.set('sanitizeFilter', true);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;





const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 });

app.use(helmet());

// Used this to allow vercel and render to connect
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://final-frontend-zeta-one.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to allow during demo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// 1. Mount CORS middleware BEFORE any routes
app.use(cors(corsOptions));

// 2. Explicitly handle preflight OPTIONS requests without path wildcards
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());


mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('The Skill server is running!');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});



// Auth endpoints
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRouter);

// Skill endpoints
app.use('/api/skills', skillRouter);




// This is the error handler 
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack || err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});