import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useWatchlistToggle} from "../hooks/useWatchlist";


const F    = "system-ui, -apple-system, sans-serif";
const RED  = "#c0392b";
const IMG  = "https://image.tmdb.org/t/p";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Backdrop skeleton */}
      <div style={{ height: "60vh", background: "linear-gradient(90deg,#181818 25%,#222 50%,#181818 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
      <div style={{ padding: "40px 5%", maxWidth: "900px" }}>
        <div style={{ height: "36px", width: "50%", borderRadius: "6px", background: "#181818", marginBottom: "16px", animation: "shimmer 1.4s infinite" }} />
        <div style={{ height: "14px", width: "30%", borderRadius: "4px", background: "#181818", marginBottom: "24px", animation: "shimmer 1.4s infinite" }} />
        <div style={{ height: "80px", borderRadius: "6px", background: "#181818", animation: "shimmer 1.4s infinite" }} />
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

// ── Cast Card ─────────────────────────────────────────────────────────────────
function CastCard({ person }) {
  const [hovered, setHovered] = useState(false);
  const photo = person.profile_path ? `${IMG}/w185${person.profile_path}` : null;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flexShrink: 0, width: "90px", cursor: "default", transform: hovered ? "translateY(-4px)" : "none", transition: "transform 0.25s ease" }}>
      <div style={{ width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", background: "#1e1e1e", border: hovered ? `2px solid ${RED}` : "2px solid transparent", transition: "border 0.2s", boxShadow: hovered ? `0 6px 20px rgba(192,57,43,0.35)` : "none" }}>
        {photo
          ? <img src={photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>👤</div>
        }
      </div>
      <p style={{ color: "#fff", fontSize: "0.7rem", margin: "8px 0 2px", textAlign: "center", fontFamily: F, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.name}</p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", margin: 0, textAlign: "center", fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{person.character}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MovieDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { movie, loading, error } = useMovieDetail(id);
  const [showTrailer, setShowTrailer] = useState(false);

  const { inWatchlist, loading: wLoading, toggle } = useWatchlistToggle(movie);

  if (loading) return <DetailSkeleton />;

  if (error || !movie) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: F, flexDirection: "column", gap: "16px" }}>
      <span style={{ fontSize: "2rem" }}>🎬</span>
      <p>Movie not found</p>
      <button onClick={() => navigate(-1)} style={{ padding: "8px 20px", borderRadius: "6px", border: "none", background: RED, color: "#fff", cursor: "pointer", fontFamily: F, fontSize: "0.85rem" }}>Go Back</button>
    </div>
  );

  const backdrop  = movie.backdrop_path ? `${IMG}/original${movie.backdrop_path}` : null;
  const poster    = movie.poster_path   ? `${IMG}/w500${movie.poster_path}`       : null;
  const runtime   = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const year      = movie.release_date?.slice(0, 4);
  const rating    = movie.vote_average?.toFixed(1);
  const trailer   = movie.trailer;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: F }}>

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        position: "fixed", top: "18px", left: "20px", zIndex: 200,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)", color: "#fff",
        width: "40px", height: "40px", borderRadius: "50%",
        cursor: "pointer", fontSize: "1.1rem", display: "flex",
        alignItems: "center", justifyContent: "center", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = RED}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
      >←</button>

      {/* Hero backdrop */}
      <div style={{ position: "relative", height: "62vh", minHeight: "380px", overflow: "hidden" }}>
        {backdrop && (
          <img src={backdrop} alt={movie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0a0a0a 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

        {/* Play trailer btn on backdrop */}
        {trailer && (
          <button onClick={() => setShowTrailer(true)}
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", border: `2px solid rgba(255,255,255,0.3)`, color: "#fff", width: "64px", height: "64px", borderRadius: "50%", cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.transform = "translate(-50%,-50%) scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.55)"; e.currentTarget.style.transform = "translate(-50%,-50%) scale(1)"; }}
          >▶</button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "0 5% 60px", maxWidth: "960px", marginTop: "-120px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Poster */}
          {poster && (
            <img src={poster} alt={movie.title}
              style={{ width: "160px", flexShrink: 0, borderRadius: "10px", boxShadow: "0 16px 48px rgba(0,0,0,0.8)", display: "block" }}
            />
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: "260px", paddingTop: poster ? "60px" : "0" }}>
            <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 10px", fontFamily: F, lineHeight: 1.15 }}>
              {movie.title}
            </h1>

            {/* Meta row */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
              {rating && <span style={{ color: RED, fontWeight: 700, fontSize: "0.9rem" }}>⭐ {rating}</span>}
              {year   && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>{year}</span>}
              {runtime && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>🕐 {runtime}</span>}
              {movie.status && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "2px 8px" }}>{movie.status}</span>}
            </div>

            {/* Genres */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
              {movie.genres?.map(g => (
                <span key={g.id} style={{ padding: "4px 12px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontFamily: F }}>
                  {g.name}
                </span>
              ))}
            </div>

            {/* Tagline */}
            {movie.tagline && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", fontStyle: "italic", margin: "0 0 14px", fontFamily: F }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", lineHeight: 1.8, margin: "0 0 28px", fontFamily: F }}>
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {trailer && (
                <button onClick={() => setShowTrailer(true)} style={{ padding: "11px 24px", borderRadius: "6px", border: "none", background: RED, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: F, transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  ▶ Watch Trailer
                </button>
              )}
             <button
  onClick={toggle}
  disabled={wLoading}
  style={{
    padding: "11px 24px", borderRadius: "6px",
    border: `1px solid ${inWatchlist ? RED : "rgba(255,255,255,0.15)"}`,
    background: inWatchlist ? "rgba(192,57,43,0.1)" : "transparent",
    color: inWatchlist ? RED : "rgba(255,255,255,0.6)",
    fontWeight: 500, fontSize: "0.85rem", cursor: wLoading ? "not-allowed" : "pointer",
    fontFamily: F, transition: "all 0.2s",
    opacity: wLoading ? 0.6 : 1,
  }}
  onMouseEnter={e => {
    if (!wLoading) {
      e.currentTarget.style.color = inWatchlist ? "#e55" : "#fff";
      e.currentTarget.style.borderColor = inWatchlist ? "#e55" : "rgba(255,255,255,0.35)";
    }
  }}
  onMouseLeave={e => {
    e.currentTarget.style.color = inWatchlist ? RED : "rgba(255,255,255,0.6)";
    e.currentTarget.style.borderColor = inWatchlist ? RED : "rgba(255,255,255,0.15)";
  }}
>
  {wLoading ? "..." : inWatchlist ? "✓ Saved" : "+ My List"}
</button>
            </div>
          </div>
        </div>

        {/* Extra stats */}
        <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", margin: "40px 0 36px", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Vote Count", value: movie.vote_count?.toLocaleString() },
            { label: "Budget", value: movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(0)}M` : "—" },
            { label: "Revenue", value: movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(0)}M` : "—" },
            { label: "Language", value: movie.original_language?.toUpperCase() },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px", fontFamily: F }}>{stat.label}</p>
              <p style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: 0, fontFamily: F }}>{stat.value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Cast */}
        {movie.cast?.length > 0 && (
          <div>
            <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, margin: "0 0 18px", fontFamily: F }}>🎭 Cast</h3>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" }}>
              {movie.cast.map(person => <CastCard key={person.id} person={person} />)}
            </div>
          </div>
        )}
      </div>

      {/* Trailer modal */}
      {showTrailer && trailer && (
        <div onClick={() => setShowTrailer(false)} style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "860px", position: "relative" }}>
            <button onClick={() => setShowTrailer(false)} style={{ position: "absolute", top: "-40px", right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "1.3rem", cursor: "pointer", fontFamily: F }}>✕ Close</button>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "10px", overflow: "hidden" }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Trailer"
                allow="autoplay; fullscreen"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}