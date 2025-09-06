// external
import React, { useState, useEffect } from "react";
import { Gift, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// internal
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const LoginPage: React.FC = () => {
  // use states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // variables
  const { login, isLoading, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // use effects
  useEffect(() => {
    if (admin) {
      navigate(from, { replace: true });
    }
  }, [admin, navigate, from]);

  // handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>

      <div className="login-card">
        <div className="text-center mb-8">
          <div className="login-icon">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PinkyPromises</h1>
          <p className="text-white" style={{ opacity: 0.7 }}>
            Sign in to the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  paddingLeft: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <Mail
                  className="h-5 w-5"
                  style={{ color: "rgba(255, 255, 255, 0.4)" }}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative">
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  paddingLeft: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                <Lock
                  className="h-5 w-5"
                  style={{ color: "rgba(255, 255, 255, 0.4)" }}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                style={{ paddingRight: "3rem" }}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0"
                style={{
                  paddingRight: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <EyeOff
                    className="h-5 w-5"
                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                  />
                ) : (
                  <Eye
                    className="h-5 w-5"
                    style={{ color: "rgba(255, 255, 255, 0.4)" }}
                  />
                )}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            Made with 🤍 my Paris
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
