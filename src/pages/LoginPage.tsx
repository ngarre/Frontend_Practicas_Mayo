import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest } from "../types/auth.types";
import "./AuthPages.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from || "/";
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);

      setFormData({
        email: "",
        password: "",
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-floating auth-floating--one">🌿</div>
      <div className="auth-floating auth-floating--two">✨</div>
      <div className="auth-floating auth-floating--three">🥣</div>
      <div className="auth-floating auth-floating--four">💌</div>

      <section className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🌿</div>
          <h1>Log in</h1>
          <p>
            Welcome back to Cozy Bites. Sign in to keep enjoying your healthy
            favorites.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="youremail@email.com"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-message auth-message--error">{error}</p>}

          <button className="auth-form__button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}