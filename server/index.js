// Local development entry point. On Vercel the app is served by api/index.js
// instead, which never calls listen().
import app from './app.js';
import connectDB from './db.js';

const port = process.env.PORT || 5001;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`Server running on PORT: ${port}`));
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
