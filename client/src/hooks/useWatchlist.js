import { useState, useEffect } from "react";
import {
  addToWatchlistAPI,
  removeFromWatchlistAPI,
  getWatchlistAPI,
  checkWatchlistAPI,
} from "../api/watchlist.api";

// ── Full watchlist hook (Watchlist Page)
export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getWatchlistAPI()
      .then(res => setWatchlist(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (movieId) => {
    await removeFromWatchlistAPI(movieId);
    setWatchlist(prev => prev.filter(m => m.movieId !== movieId));
  };

  return { watchlist, loading, remove };
};

// ── Single movie watchlist hook (MovieDetail page)
export const useWatchlistToggle = (movie) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (!movie?.id) return;
    checkWatchlistAPI(movie.id)
      .then(res => setInWatchlist(res.data.inWatchlist))
      .catch(() => {});
  }, [movie?.id]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlistAPI(movie.id);
        setInWatchlist(false);
      } else {
        await addToWatchlistAPI({
          movieId: movie.id,
          title:   movie.title,
          poster:  movie.poster_path,
          rating:  movie.vote_average,
          year:    movie.release_date?.slice(0, 4),
        });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { inWatchlist, loading, toggle };
};