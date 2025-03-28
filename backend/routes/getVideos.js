const express = require("express");
const { VideoModel } = require("../models/videoModel");
const { authMid } = require("../middleware/authMid");

const videosListRouter = express.Router();


videosListRouter.get("/get_videos", authMid, async (req, res) => {
  try {
    const username = req.user?.username;

    if (!username) {
      return res.status(400).json({ msg: "Username not found in request" });
    }

    const videosData = await VideoModel.find({ username });
    res.status(200).send(videosData);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});
videosListRouter.get("/get_videos", authMid, async (req, res) => {
  try {
    const username = req.user?.username;

    if (!username) {
      return res.status(400).json({ msg: "Username not found in request" });
    }

    const videosData = await VideoModel.find({ username });
    res.status(200).send(videosData);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = { videosListRouter };
