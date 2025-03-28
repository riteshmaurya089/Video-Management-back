const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const { Readable } = require("stream"); // Import Readable for buffer conversion
const { VideoModel } = require("../models/videoModel");
const { authMid } = require("../middleware/authMid");

dotenv.config();

const videosUploadRouter = express.Router();

// Google OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// Configure Multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

videosUploadRouter.post("/video_upload", authMid, upload.single("video"), async (req, res) => {
  const { title, description, tags } = req.body;
  const username = req.user?.username;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    // Upload file to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream, // Use Readable stream instead of Buffer
      },
    });

    // Get Google Drive File ID
    const fileId = driveResponse.data.id;

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get the public file URL
    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;

    // Save video details to MongoDB
    const video = new VideoModel({
      title,
      description,
      tags: tags ? tags.split(",") : [],
      filePath: fileUrl, // Store the Google Drive link instead of local path
      fileSize: req.file.size,
      uploadedAt: new Date(),
      username,
    });

    await video.save();

    res.status(201).json({ message: "Video uploaded successfully", video });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = { videosUploadRouter };
