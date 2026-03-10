import { useEffect, useState } from "react";

export default function Loader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'system-ui', serif",
      }}
    >
      {/* Logo */}
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          color: "#E50914",
          margin: "0 0 48px 0",
          textShadow: "0 0 30px rgba(229,9,20,0.5)",
          animation: "flicker 3s ease-in-out infinite",
        }}
      >
        CINEVERSE
      </h1>

      {/* 5 bouncing bars */}
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "36px" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "4px",
              borderRadius: "4px",
              background: i === 2 ? "#E50914" : `rgba(229,9,20,${0.3 + i * 0.1})`,
              animation: `bounce 1s ease-in-out infinite`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      <p
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.65rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          margin: "28px 0 0 0",
        }}
      >
        Loading{dots}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 100% { height: 12px; opacity: 0.5; }
          50% { height: 36px; opacity: 1; }
        }
        @keyframes flicker {
          0%, 94%, 100% { opacity: 1; }
          95% { opacity: 0.6; }
          97% { opacity: 0.85; }
          99% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}