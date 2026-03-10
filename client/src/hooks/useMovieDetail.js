import { useState, useEffect } from "react";
import BASE_URL from "../utils/config";
import axios from "axios";

const api = axios.create({ baseURL: BASE_URL + "/api/movies" });

export const useMovieDetail = (id) => {
  const [movie, setMovie]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setMovie(null);
    setError(null);

    api.get(`/${id}`)
      .then(res => setMovie(res.data))
      .catch(() => setError("Failed to load movie details"))
      .finally(() => setLoading(false));
  }, [id]);

  return { movie, loading, error };
};