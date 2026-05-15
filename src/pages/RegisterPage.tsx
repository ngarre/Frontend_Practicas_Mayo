import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import type { RegisterRequest } from "../types/auth.types";
import "./AuthPages.css";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: string;
  advertising: boolean;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const initialFormData: RegisterFormData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    advertising: false,
  };

  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const registerData: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: Number(formData.age),
        advertising: formData.advertising,
      };

      const response = await register(registerData);
      setSuccessMessage(response);

      setFormData(initialFormData);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("We couldn't create your account. Please check your details or try another email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-floating auth-floating--one">🥑</div>
      <div className="auth-floating auth-floating--two">🌸</div>
      <div className="auth-floating auth-floating--three">🥗</div>
      <div className="auth-floating auth-floating--four">✨</div>
      
      <section className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">🥑</div>
          <h1>Create account</h1>
          <p>
            Join Cozy Bites and start saving your favorite healthy orders.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="auth-form__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Vitalis Cozybites"
              autoComplete="off"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="youremail@email.com"
              autoComplete="off"
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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="600123123"
              autoComplete="off"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              min={1}
              placeholder="18"
              required
            />
          </div>

          <label className="auth-form__checkbox" htmlFor="advertising">
            <input
              id="advertising"
              name="advertising"
              type="checkbox"
              checked={formData.advertising}
              onChange={handleChange}
            />
            <span>I want to receive news, healthy menus and cozy offers.</span>
          </label>

          {error && <p className="auth-message auth-message--error">{error}</p>}

          {successMessage && (
            <p className="auth-message auth-message--success">{successMessage}</p>
          )}

          <button className="auth-form__button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}