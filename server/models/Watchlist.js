const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: Number,  // TMDB movie ID
    required: true,
  },
  title: { type: String, required: true },
  poster: { type: String },
  rating: { type: Number },
  year:   { type: String },
  addedAt: { type: Date, default: Date.now },
});

// Ek user same movie dobara add na kar sake
watchlistSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);