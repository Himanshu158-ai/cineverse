const express = require("express");
const Watchlist = require("../models/Watchlist.js");
const UserMiddleware = require("../middleware/UserMiddleware.js");

const router = express.Router();

// Add movie
router.post("/add", UserMiddleware, async (req, res) => {
  try {
    const { movieId, title, poster, rating, year } = req.body;
    const existing = await Watchlist.findOne({ user: req.user.id, movieId });
    if (existing) return res.status(400).json({ message: "Already in watchlist" });

    const item = await Watchlist.create({ user: req.user.id, movieId, title, poster, rating, year });
    res.status(201).json({ message: "Added to watchlist", item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove movie
router.delete("/:movieId", UserMiddleware, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({ user: req.user.id, movieId: req.params.movieId });
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all
router.get("/", UserMiddleware, async (req, res) => {
  try {
    const list = await Watchlist.find({ user: req.user.id }).sort({ addedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Check single movie
router.get("/check/:movieId", UserMiddleware, async (req, res) => {
  try {
    const item = await Watchlist.findOne({ user: req.user.id, movieId: req.params.movieId });
    res.json({ inWatchlist: !!item });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;