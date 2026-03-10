import { useState, useEffect, useRef } from "react";
import { useMovies } from "../hooks/useMovies";
import Loading from "../components/Loader";
import { IMG_BASE } from "../api/tmdb.api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const F = "system-ui, -apple-system, sans-serif";
const RED = "#c0392b";
const RED_DIM = "rgba(192,57,43,0.85)";

const poster = (path) => path ? `${IMG_BASE}/w500${path}` : null;
const backdrop = (path) => path ? `${IMG_BASE}/original${path}` : null;

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ scrolled, searchOpen, setSearchOpen, searchQuery, setSearchQuery }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useAuth();
  const links = [
    { label: "Home", path: "/home" },
    { label: "Movies", path: "/movies" },
    { label: "My List", path: "/watchlist" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 5%", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled
        ? "rgba(10,10,10,0.6)"
        : "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "background 0.4s ease",
      fontFamily: F,
    }}>
      {/* Logo */}
      <h1 style={{ fontSize: "1.4rem", fontWeight: 900, color: RED, letterSpacing: "0.2em", margin: 0, fontFamily: F, cursor: "pointer", flexShrink: 0 }}>
        CINEVERSE
      </h1>

      {/* Desktop links */}
      {/* Desktop links */}
<div style={{ display: "flex", gap: "28px", alignItems: "center" }} className="cv-desktop-links">
  {links.map((item) => (
    <span
      key={item.label}
      onClick={() => navigate(item.path)}
      style={{
        color: location.pathname === item.path ? "#fff" : "rgba(255,255,255,0.5)",
        fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "color 0.2s",
      }}
      onMouseEnter={e => e.target.style.color = "#fff"}
      onMouseLeave={e => e.target.style.color = location.pathname === item.path ? "#fff" : "rgba(255,255,255,0.5)"}
    >{item.label}</span>
  ))}

  {/* Logout button */}
  </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {searchOpen && (
          <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px", padding: "7px 14px", color: "#fff", fontSize: "0.8rem", outline: "none", width: "180px", fontFamily: F, backdropFilter: "blur(8px)" }}
          />
        )}
        <button onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: "1.1rem", padding: "4px", lineHeight: 1 }}>
          {searchOpen ? "✕" : "🔍"}
        </button>

        {/* Hamburger — mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="cv-hamburger"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "1.3rem", padding: "4px", display: "none" }}>
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {
        menuOpen && (
          <div className="cv-mobile-menu" style={{ position: "absolute", top: "64px", left: 0, right: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)", padding: "16px 5%", display: "flex", flexDirection: "column", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["Home", "Movies", "My List"].map(item => (
              <span key={item} onClick={() => { navigate(item === "Home" ? "/home" : item === "Movies" ? "/movies" : item === "My List" ? "/watchlist" : `/${item.toLowerCase().replace(" ", "")}`); setMenuOpen(false); }} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", cursor: "pointer", fontFamily: F, padding: "4px 0" }}>{item}</span>
            ))}
          </div>
        )
      }

      <style>{`
        @media (max-width: 640px) {
          .cv-desktop-links { display: none !important; }
          .cv-hamburger { display: block !important; }
        }
      `}</style>
    </nav >
  );
}

// ── Hero Slider ──────────────────────────────────────────────────────────────
function HeroSlider({ movies }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => goTo((current + 1) % movies.length), 5000);
    return () => clearInterval(t);
  }, [current, movies.length]);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 380);
  };

  if (!movies.length) return (
    <div style={{ height: "92vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${RED}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  const movie = movies[current];

  return (
    <div style={{ position: "relative", height: "92vh", minHeight: "520px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: animating ? 0 : 1, transition: "opacity 0.38s ease" }}>
        <img src={backdrop(movie.backdrop_path)} alt={movie.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.1) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0a 0%, transparent 52%)" }} />

      {/* Content */}
      <div style={{ position: "absolute", bottom: "18%", left: "5%", right: "5%", maxWidth: "500px", opacity: animating ? 0 : 1, transform: animating ? "translateY(14px)" : "translateY(0)", transition: "opacity 0.38s ease, transform 0.38s ease", fontFamily: F }}>

        <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
          {movie.genre_ids?.slice(0, 3).map(g => (
            <span key={g} style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "3px", padding: "3px 9px", textTransform: "uppercase", fontFamily: F }}>
              {GENRE_MAP[g] || "Movie"}
            </span>
          ))}
        </div>

        <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.1, fontFamily: F, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
          {movie.title}
        </h2>

        <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: RED, fontWeight: 600, fontSize: "0.85rem" }}>⭐ {movie.vote_average?.toFixed(1)}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{movie.release_date?.slice(0, 4)}</span>
        </div>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.75, margin: "0 0 24px", fontFamily: F, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {movie.overview}
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button style={{ padding: "11px 26px", borderRadius: "6px", border: "none", background: RED, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "opacity 0.2s, transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
            onClick={() => navigate(`/movie/${movie.id}`)}>
            ▶ Play Now
          </button>
          <button style={{ padding: "11px 26px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 500, fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            onClick={() => navigate("/watchlist")}>
            + My List
          </button>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: "6%", left: "5%", display: "flex", gap: "7px" }}>
        {movies.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i === current ? "24px" : "7px", height: "7px", borderRadius: "4px", border: "none", cursor: "pointer", background: i === current ? RED : "rgba(255,255,255,0.25)", transition: "all 0.3s ease", padding: 0 }} />
        ))}
      </div>

      {/* Arrows */}
      {["left", "right"].map(dir => (
        <button key={dir} onClick={() => goTo(dir === "left" ? (current - 1 + movies.length) % movies.length : (current + 1) % movies.length)}
          style={{ position: "absolute", [dir]: "14px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s", zIndex: 10 }}
          onMouseEnter={e => e.currentTarget.style.background = RED_DIM}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
        >{dir === "left" ? "‹" : "›"}</button>
      ))}
    </div>
  );
}

// ── Movie Card ───────────────────────────────────────────────────────────────
function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const imgSrc = poster(movie.poster_path);

  return (
    <div onClick={() => navigate(`/movie/${movie.id}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: "clamp(130px, 16vw, 160px)", cursor: "pointer", transform: hovered ? "scale(1.05) translateY(-4px)" : "scale(1)", transition: "transform 0.28s ease", position: "relative", zIndex: hovered ? 10 : 1 }}>

      <div style={{ width: "100%", aspectRatio: "2/3", borderRadius: "8px", overflow: "hidden", background: "#181818", position: "relative", boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.85), 0 0 0 1px ${RED}55` : "0 4px 10px rgba(0,0,0,0.5)", transition: "box-shadow 0.28s" }}>
        {imgSrc ? (
          <img src={imgSrc} alt={movie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.38s ease", transform: hovered ? "scale(1.07)" : "scale(1)" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#181818", color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", textAlign: "center", padding: "12px", fontFamily: F }}>
            🎬<br />{movie.title}
          </div>
        )}

        <div style={{ position: "absolute", inset: 0, background: hovered ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" : "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)", transition: "background 0.28s ease", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "10px" }}>
          {hovered && (
            <div style={{ animation: "popIn 0.18s ease forwards" }}>
              <button style={{ width: "100%", padding: "7px 0", borderRadius: "5px", border: "none", background: RED, color: "#fff", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer", fontFamily: F, marginBottom: "6px" }}>
                ▶ View
              </button>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: RED, fontWeight: 600, fontSize: "0.7rem", fontFamily: F }}>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", fontFamily: F }}>{movie.release_date?.slice(0, 4)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "0.75rem", margin: "7px 0 0", textAlign: "center", fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: hovered ? 600 : 400, transition: "color 0.2s" }}>
        {movie.title}
      </p>
    </div>
  );
}

// ── Movie Row ────────────────────────────────────────────────────────────────
function MovieRow({ title, movies }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  if (!movies.length) return null;

  return (
    <div style={{ marginBottom: "44px" }}>
      <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: "0 0 12px 5%", fontFamily: F }}>{title}</h3>
      <div style={{ position: "relative" }}>
        {["left", "right"].map(dir => (
          <button key={dir} onClick={() => scroll(dir === "left" ? -1 : 1)}
            style={{ position: "absolute", [dir]: "6px", top: "44%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = RED_DIM}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.7)"}
          >{dir === "left" ? "‹" : "›"}</button>
        ))}
        <div ref={rowRef} style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "10px 5%", scrollbarWidth: "none" }}>
          {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "56px 5% 28px", fontFamily: F }}>

      {/* Ad section — human feel */}
      <div style={{ marginBottom: "52px", display: "flex", flexDirection: "column", gap: "0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "8px" }}>
          <span style={{ color: RED, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3rem)", fontFamily: F, lineHeight: 1 }}>CINEVERSE</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", marginBottom: "6px", fontFamily: F }}>— since 2024</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", maxWidth: "520px", lineHeight: 1.8, margin: "0 0 20px", fontFamily: F }}>
          We started CineVerse because finding a good movie shouldn't feel like homework. Everything you love — in one place, no subscriptions, no algorithms hiding gems.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: RED, color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Start Watching
          </button>
          <button style={{ padding: "10px 24px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", fontWeight: 500, fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
            Browse Movies
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "40px" }} />

      {/* Links */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "28px", marginBottom: "40px" }}>
        {[
          { heading: "Explore", links: ["Movies", "TV Shows", "Top Rated", "New Releases"] },
          { heading: "Account", links: ["My List", "Profile", "Settings", "Help"] },
          { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
          { heading: "Legal", links: ["Privacy", "Terms", "Cookies"] },
        ].map(col => (
          <div key={col.heading}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", fontFamily: F }}>{col.heading}</p>
            {col.links.map(l => (
              <p key={l} onClick={() => navigate(l === "My List" ? "/watchlist" : l === "Movies" ? "/movies" : "/home")} style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: "0 0 9px", cursor: "pointer", fontFamily: F, transition: "color 0.18s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{l}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.72rem", fontFamily: F }}>© 2024 CineVerse. All rights reserved.</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.72rem", fontFamily: F }}>Made with ♥ for cinema lovers</span>
      </div>
    </footer>
  );
}

// ── Genre Map ────────────────────────────────────────────────────────────────
const GENRE_MAP = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western" };

// ── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { heroMovies, trending, popular, topRated, searchResults, loading, error } = useMovies(searchQuery);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (loading) return <Loading />;

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: RED, fontFamily: F, fontSize: "0.9rem" }}>
      Failed to load. Please try again.
    </div>
  );

  const showSearch = searchQuery && searchResults.length > 0;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: F }}>
      <Navbar scrolled={scrolled} searchOpen={searchOpen} setSearchOpen={setSearchOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <HeroSlider movies={heroMovies} />

      <div style={{ marginTop: "-70px", position: "relative", zIndex: 10, paddingBottom: "16px" }}>
        {showSearch
          ? <MovieRow title={`🔍 "${searchQuery}"`} movies={searchResults} />
          : <>
            <MovieRow title="🔥 Trending Now" movies={trending} />
            <MovieRow title="🎬 Popular" movies={popular} />
            <MovieRow title="⭐ Top Rated" movies={topRated} />
          </>
        }
        {searchQuery && !searchResults.length && (
          <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "60px 0", fontFamily: F, fontSize: "0.88rem" }}>
            No results for "{searchQuery}"
          </p>
        )}
      </div>

      <Footer />

      <style>{`
        @keyframes popIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin  { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}