import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../hooks/useWatchlist";

const F   = "system-ui, -apple-system, sans-serif";
const RED = "#c0392b";
const IMG = "https://image.tmdb.org/t/p/w500";

function SkeletonCard() {
  return (
    <div style={{ display: "flex", gap: "16px", padding: "16px", borderRadius: "10px", background: "#141414" }}>
      <div style={{ width: "70px", height: "105px", borderRadius: "6px", flexShrink: 0, background: "linear-gradient(90deg,#1e1e1e 25%,#262626 50%,#1e1e1e 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
        <div style={{ height: "14px", width: "55%", borderRadius: "4px", background: "#1e1e1e", animation: "shimmer 1.4s infinite" }} />
        <div style={{ height: "10px", width: "30%", borderRadius: "4px", background: "#1e1e1e", animation: "shimmer 1.4s infinite" }} />
      </div>
    </div>
  );
}

function WatchlistCard({ item, onRemove }) {
  const navigate = useNavigate();
  const poster   = item.poster ? `${IMG}${item.poster}` : null;

  return (
    <div style={{ display: "flex", gap: "16px", padding: "14px", borderRadius: "10px", background: "#111", border: "1px solid rgba(255,255,255,0.05)", transition: "border-color 0.2s", cursor: "pointer" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(192,57,43,0.3)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
    >
      {/* Poster */}
      <div onClick={() => navigate(`/movie/${item.movieId}`)}
        style={{ width: "70px", height: "105px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#1a1a1a" }}>
        {poster
          ? <img src={poster} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎬</div>
        }
      </div>

      {/* Info */}
      <div onClick={() => navigate(`/movie/${item.movieId}`)} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
        <h3 style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, margin: 0, fontFamily: F }}>{item.title}</h3>
        <div style={{ display: "flex", gap: "12px" }}>
          {item.rating > 0 && <span style={{ color: RED, fontSize: "0.78rem", fontFamily: F, fontWeight: 600 }}>⭐ {item.rating?.toFixed(1)}</span>}
          {item.year && <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontFamily: F }}>{item.year}</span>}
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", margin: 0, fontFamily: F }}>
          Added {new Date(item.addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>

      {/* Remove */}
      <button onClick={() => onRemove(item.movieId)}
        style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "center", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.color = RED; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
      >✕</button>
    </div>
  );
}

export default function Watchlist() {
  const navigate               = useNavigate();
  const { watchlist, loading, remove } = useWatchlist();

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: F }}>

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 5%", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h1 onClick={() => navigate("/home")} style={{ fontSize: "1.3rem", fontWeight: 900, color: RED, letterSpacing: "0.2em", margin: 0, fontFamily: F, cursor: "pointer" }}>CINEVERSE</h1>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontFamily: F, fontSize: "0.8rem", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >← Back</button>
      </nav>

      <div style={{ paddingTop: "90px", padding: "90px 5% 60px", maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, margin: "0 0 6px", fontFamily: F }}>My Watchlist</h2>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.83rem", margin: 0, fontFamily: F }}>
            {loading ? "Loading..." : `${watchlist.length} movie${watchlist.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>

        {/* Skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {Array(5).fill(null).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && watchlist.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "3rem" }}>🎬</span>
            <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: F, fontSize: "0.9rem", margin: 0 }}>Nothing saved yet</p>
            <button onClick={() => navigate("/movies")} style={{ padding: "10px 24px", borderRadius: "6px", border: "none", background: RED, color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: F }}>
              Browse Movies
            </button>
          </div>
        )}

        {/* List */}
        {!loading && watchlist.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {watchlist.map(item => (
              <WatchlistCard key={item._id} item={item} onRemove={remove} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}