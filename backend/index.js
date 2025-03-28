require("dotenv").config(); // Load environment variables at the very top

const express = require("express");
const cors = require("cors");
const { connection } = require("./db"); // Ensure db.js is correctly configured
const { userAuthRouter } = require("./routes/authRoute");
const { videosUploadRouter } = require("./routes/uploadVideosRouter");
const { videosListRouter } = require("./routes/getVideos");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploaded videos)
app.use("/uploads/videos", express.static("uploads/videos"));

// Routes
app.use("/auth", userAuthRouter);
app.use("/upload", videosUploadRouter);
app.use("/videos", videosListRouter);

// Ensure PORT is correctly set
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connection; // Ensure MongoDB connection
        console.log(`✅ Server running on port ${PORT}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
});
