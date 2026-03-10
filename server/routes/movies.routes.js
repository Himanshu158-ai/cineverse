// routes/movies.routes.js
const axios = require("axios");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const TMDB_KEY = process.env.TMDB_KEY;
const TMDB_BASE = "https://api.tmdb.org/3";

router.get("/now-playing", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/now_playing?api_key=${TMDB_KEY}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/popular", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/top-rated", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const { data } = await axios.get(`${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${query}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/discover", async (req, res) => {
  try {
    const { page = 1, genre = "" } = req.query;
    const url = genre
      ? `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&page=${page}&with_genres=${genre}`
      : `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&page=${page}&sort_by=popularity.desc`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/genres", async (req, res) => {
  try {
    const { data } = await axios.get(`${TMDB_BASE}/genre/movie/list?api_key=${TMDB_KEY}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// movies.routes.js me add karo
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [details, credits, videos] = await Promise.all([
      axios.get(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/credits?api_key=${TMDB_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/videos?api_key=${TMDB_KEY}`),
    ]);
    res.json({
      ...details.data,
      cast: credits.data.cast?.slice(0, 10),
      trailer: videos.data.results?.find(v => v.type === "Trailer" && v.site === "YouTube"),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;