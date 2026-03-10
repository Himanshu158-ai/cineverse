import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { useNavigate } from "react-router-dom";

const F   = "system-ui, -apple-system, sans-serif";
const RED = "#c0392b";
const IMG = "https://image.tmdb.org/t/p/w500";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ flexShrink: 0, width: "100%" }}>
      <div style={{
        width: "100%", aspectRatio: "2/3", borderRadius: "8px",
        background: "linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }} />
      <div style={{ height: "10px", borderRadius: "4px", background: "#1a1a1a", marginTop: "10px", width: "70%", animation: "shimmer 1.4s infinite 0.2s" }} />
      <div style={{ height: "8px", borderRadius: "4px", background: "#1a1a1a", marginTop: "6px", width: "45%", animation: "shimmer 1.4s infinite 0.3s" }} />
    </div>
  );
}

// ── Movie Card ────────────────────────────────────────────────────────────────
function MovieCard({ movie, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const imgSrc = movie.poster_path ? `${IMG}${movie.poster_path}` : null;

  return (
    <div
    onClick={() => navigate(`/movie/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", cursor: "pointer",
        transform: hovered ? "scale(1.04) translateY(-4px)" : "scale(1)",
        transition: "transform 0.28s ease",
        position: "relative", zIndex: hovered ? 10 : 1,
        animation: "fadeInUp 0.4s ease forwards",
        animationDelay: `${(index % 20) * 0.04}s`,
        opacity: 0,
      }}
    >
      {/* Poster */}
      <div style={{
        width: "100%", aspectRatio: "2/3", borderRadius: "8px",
        overflow: "hidden", background: "#181818", position: "relative",
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,0.85), 0 0 0 1px ${RED}55`
          : "0 3px 10px rgba(0,0,0,0.5)",
        transition: "box-shadow 0.28s",
      }}>
        {/* Skeleton until image loads */}
        {!imgLoaded && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }} />
        )}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={movie.title}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.3s ease, transform 0.35s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", textAlign: "center", padding: "12px", fontFamily: F }}>
            🎬<br />{movie.title}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)",
          transition: "background 0.28s ease",
          display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "10px",
        }}>
          {hovered && (
            <div style={{ animation: "popIn 0.18s ease forwards" }}>
              <button style={{
                width: "100%", padding: "7px 0", borderRadius: "5px",
                border: "none", background: RED, color: "#fff",
                fontWeight: 700, fontSize: "0.7rem", cursor: "pointer",
                fontFamily: F, marginBottom: "6px",
              }}>▶ View</button>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: RED, fontWeight: 600, fontSize: "0.68rem", fontFamily: F }}>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", fontFamily: F }}>{movie.release_date?.slice(0, 4)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Rating badge */}
        {!hovered && movie.vote_average > 0 && (
          <div style={{
            position: "absolute", top: "8px", right: "8px",
            background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
            borderRadius: "4px", padding: "3px 7px",
            fontSize: "0.65rem", color: "#fff", fontFamily: F, fontWeight: 600,
          }}>
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
        )}
      </div>

      {/* Title */}
      <p style={{
        color: hovered ? "#fff" : "rgba(255,255,255,0.5)",
        fontSize: "0.75rem", margin: "8px 0 2px",
        fontFamily: F, overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", fontWeight: hovered ? 600 : 400,
        transition: "color 0.2s",
      }}>{movie.title}</p>
      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", margin: 0, fontFamily: F }}>
        {movie.release_date?.slice(0, 4)}
      </p>
    </div>
  );
}

// ── Genre Pill ────────────────────────────────────────────────────────────────
function GenrePill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      padding: "7px 16px", borderRadius: "20px", cursor: "pointer",
      border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
      background: active ? RED : "rgba(255,255,255,0.05)",
      color: active ? "#fff" : "rgba(255,255,255,0.55)",
      fontSize: "0.78rem", fontFamily: F, fontWeight: active ? 600 : 400,
      transition: "all 0.2s ease",
      backdropFilter: "blur(4px)",
    }}>
      {label}
    </button>
  );
}

// ── Main Movies Page ──────────────────────────────────────────────────────────
export default function Movies() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [scrolled, setScrolled]           = useState(false);
  const observerRef                        = useRef(null);
  const sentinelRef                        = useRef(null);
  const navigate                           = useNavigate();

  const { movies, genres, loading, initLoading, hasMore, error, loadMore } = useInfiniteMovies(selectedGenre);

  // Navbar scroll
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Infinite scroll — IntersectionObserver
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const skeletons = Array(20).fill(null);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: F }}>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,10,0.7)" : "rgba(10,10,10,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        transition: "background 0.3s",
      }}>
        <div onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: RED, letterSpacing: "0.2em", margin: 0, fontFamily: F }}>
            CINEVERSE
          </h1>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Home", "Movies", "My List"].map(item => (
            <span key={item} onClick={() => navigate(item === "Home" ? "/home" : item === "Movies" ? "/movies" : "/watchlist")} style={{
              color: item === "Movies" ? "#fff" : "rgba(255,255,255,0.45)",
              fontSize: "0.83rem", fontFamily: F, cursor: "pointer",
              fontWeight: item === "Movies" ? 600 : 400,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = item === "Movies" ? "#fff" : "rgba(255,255,255,0.45)"}
            >{item}</span>
          ))}
        </div>
      </nav>

      {/* Page header */}
      <div style={{ paddingTop: "90px", paddingBottom: "24px", paddingLeft: "5%", paddingRight: "5%" }}>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, color: "#fffffff1", margin: "0 0 6px", fontFamily: F, letterSpacing: "-0.01em" }}>
          The World's Cinema, All in One Place
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", margin: "0 0 28px", fontFamily: F }}>
          {selectedGenre ? `Filtered by genre` : "Explore everything — sorted by popularity"}
        </p>

        {/* Genre filters */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
          <GenrePill label="All" active={selectedGenre === ""} onClick={() => setSelectedGenre("")} />
          {genres.map(g => (
            <GenrePill key={g.id} label={g.name} active={selectedGenre === String(g.id)} onClick={() => setSelectedGenre(String(g.id))} />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: F, fontSize: "0.88rem" }}>
          {error}
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "20px 14px",
        padding: "0 5% 40px",
      }}>
        {/* Initial skeleton */}
        {initLoading && skeletons.map((_, i) => <SkeletonCard key={i} />)}

        {/* Real cards */}
        {!initLoading && movies.map((movie, i) => (
          <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i} />
        ))}

        {/* Bottom load-more skeletons */}
        {loading && !initLoading && skeletons.slice(0, 8).map((_, i) => <SkeletonCard key={`load-${i}`} />)}
      </div>

      {/* Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: "40px" }} />

      {/* End message */}
      {!hasMore && !loading && movies.length > 0 && (
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.78rem", padding: "0 0 40px", fontFamily: F }}>
          — You've seen it all —
        </p>
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}