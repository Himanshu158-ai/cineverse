import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthState } from "../../context/auth.context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const { handleLogin } = useAuth();           // Hook layer se logic lo
  const { loading } = useAuthState();    // State layer se data lo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = await handleLogin(email, password); // ← message aaya
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col relative overflow-hidden">

      {/* Background cinematic effect */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />

      {/* Main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div
            className="rounded-2xl px-8 py-10 sm:px-12 sm:py-12"
            style={{
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
            }}
          >
            <h2
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'system-ui', serif" }}
            >
              Sign In
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Welcome back to CineVerse
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-zinc-800/80 text-white text-sm outline-none transition-all duration-200"
                  style={{
                    border: focused === "email" ? "1.5px solid #E50914" : "1.5px solid rgba(255,255,255,0.1)",
                  }}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-red-500
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                >
                  Email
                </label>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 pr-12 rounded-lg bg-zinc-800/80 text-white text-sm outline-none transition-all duration-200"
                  style={{
                    border: focused === "password" ? "1.5px solid #E50914" : "1.5px solid rgba(255,255,255,0.1)",
                  }}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-200 pointer-events-none
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-red-500
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                >
                  Password
                </label>
                {/* Show/hide password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-xs font-medium"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-bold text-white text-sm tracking-wider transition-all duration-200 mt-2 relative overflow-hidden"
                style={{
                  background: loading ? "#a00" : "#E50914",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(229,9,20,0.4)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "SIGN IN"
                )}
              </button>

              {error && (
                <p className="text-red-500 text-sm text-center mt-2">
                  ⚠️ {error}
                </p>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-gray-500 text-xs">OR</span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-gray-400 text-sm">
              New to CineVerse?{" "}
              <a
                href="/register"
                className="font-semibold hover:underline transition-colors"
                style={{ color: "#E50914" }}
              >
                Sign up now
              </a>
            </p>
          </div>

          {/* Bottom note */}
          <p className="text-center text-gray-600 text-xs mt-6 px-4">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </main>
    </div>
  );
}