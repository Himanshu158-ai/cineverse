import { useState, useEffect, useCallback } from "react";
import BASE_URL from "../utils/config";
import axios from "axios";

const api = axios.create({ baseURL: BASE_URL + "/api/movies" });

export const useInfiniteMovies = (genre = "") => {
  const [movies, setMovies]       = useState([]);
  const [genres, setGenres]       = useState([]);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [hasMore, setHasMore]     = useState(true);
  const [error, setError]         = useState(null);

  // Fetch genres once
  useEffect(() => {
    api.get("/genres")
      .then(res => setGenres(res.data.genres || []))
      .catch(() => {});
  }, []);

  // Reset on genre change
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setInitLoading(true);
  }, [genre]);

  // Fetch movies
  useEffect(() => {
    if (!hasMore) return;

    const fetchMovies = async () => {
      try {
        setError(null);
        page === 1 ? setInitLoading(true) : setLoading(true);
        const params = genre ? `?page=${page}&genre=${genre}` : `?page=${page}`;
        const res = await api.get(`/discover${params}`);
        const results = res.data.results || [];

        setMovies(prev => page === 1 ? results : [...prev, ...results]);
        setHasMore(page < (res.data.total_pages || 1) && page < 20); // max 20 pages
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
        setInitLoading(false);
      }
    };

    fetchMovies();
  }, [page, genre]);

  const loadMore = useCallback(() => {
    if (!loading && !initLoading && hasMore) setPage(p => p + 1);
  }, [loading, initLoading, hasMore]);

  return { movies, genres, loading, initLoading, hasMore, error, loadMore };
};