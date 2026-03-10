import axios from "axios";
import BASE_URL from "../utils/config";

const api = axios.create({
  baseURL: BASE_URL + "/api/watchlist",
  withCredentials: true,
});

export const addToWatchlistAPI    = (movie) => api.post("/add", movie);
export const removeFromWatchlistAPI = (movieId) => api.delete(`/${movieId}`);
export const getWatchlistAPI      = () => api.get("/");
export const checkWatchlistAPI    = (movieId) => api.get(`/check/${movieId}`);