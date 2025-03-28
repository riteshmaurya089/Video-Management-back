const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  tags: { type: [String], default: [] },
  filePath: { type: String },
  fileSize: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
  username: { type: String }});

const VideoModel = mongoose.model("Video", videoSchema);

module.exports = { VideoModel };
