import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Comma-separated list of allowed origins. Unset (local dev) allows any.
const allowed = process.env.CLIENT_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: allowed?.length ? allowed : true }));

// On serverless the function may be cold, so make sure the database is up
// before any route touches it.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
  }
});

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Memories API'));

export default app;
