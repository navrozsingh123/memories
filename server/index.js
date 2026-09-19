import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Memories API'));

connectDB().then(() =>
  app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  }),
);
