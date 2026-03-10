import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './Auth/pages/Login'
import Register from './Auth/pages/Register'
import { AuthProvider, useAuthState } from './context/auth.context'
import Home from './Home/Home'
import Loader from './components/Loader'
import Movies from './Home/Movies'
import MovieDetail from './Home/Moviedetail'
import Watchlist from './watchlist/Watchlist'

// Root check component
const RootRedirect = () => {
  const { user, loading } = useAuthState();

  if (loading) return (
    <Loader/>
  );

  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

const App = () => {
  return (
    <AuthProvider>  {/* ← poori app wrap */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />   {/* ← root check */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App