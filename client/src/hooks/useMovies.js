import { useState, useEffect } from "react";
import {
  getNowPlayingAPI,
  getTrendingAPI,
  getPopularAPI,
  getTopRatedAPI,
  searchMoviesAPI,
} from "../api/tmdb.api";

export const useMovies = (searchQuery = "") => {
  const [heroMovies, setHeroMovies]     = useState([]);
  const [trending, setTrending]         = useState([]);
  const [popular, setPopular]           = useState([]);
  const [topRated, setTopRated]         = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // Fetch all on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [nowPlaying, trend, pop, top] = await Promise.all([
          getNowPlayingAPI(),
          getTrendingAPI(),
          getPopularAPI(),
          getTopRatedAPI(),
        ]);

        // Hero — first 4 movies with backdrop
        setHeroMovies(
          nowPlaying.data.results
            .filter(m => m.backdrop_path)
            .slice(0, 4)
        );
        setTrending(trend.data.results.slice(0, 10));
        setPopular(pop.data.results.slice(0, 10));
        setTopRated(top.data.results.slice(0, 10));
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }

    const timer = setTimeout(async () => {
      try {
        const res = await searchMoviesAPI(searchQuery);
        setSearchResults(res.data.results.slice(0, 10));
      } catch {
        setSearchResults([]);
      }
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return { heroMovies, trending, popular, topRated, searchResults, loading, error };
};