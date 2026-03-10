// Ab TMDB directly nahi — apna backend call karega
import BASE_URL from '../utils/config';
import axios from 'axios';
const api = axios.create({ baseURL: BASE_URL + "/api/movies", withCredentials: true });

export const IMG_BASE = "https://image.tmdb.org/t/p";

export const getNowPlayingAPI = () => api.get("/now-playing");
export const getTrendingAPI   = () => api.get("/trending");
export const getPopularAPI    = () => api.get("/popular");
export const getTopRatedAPI   = () => api.get("/top-rated");
export const searchMoviesAPI  = (query) => api.get(`/search?query=${query}`);