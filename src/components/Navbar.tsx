import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { email, isAuthenticated, hasRole, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <nav className="navbar__content">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">
            <img
              src="/images/branding/cozy-bites-logo-horizontal-transparent.png"
              alt="Cozy Bites"
              className="navbar__logo-image"
            />
          </span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">
            Home
          </Link>

          <Link to="/products" className="navbar__link">
            Products
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/orders" className="navbar__link">
                My orders
              </Link>

              <Link to="/dashboard" className="navbar__link">
                Order stats
              </Link>
            </>
          )}

          {isAuthenticated && hasRole("ROLE_ADMIN") && (
            <Link to="/admin" className="navbar__link">
              Admin panel
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar__link">
                Login
              </Link>
              <Link to="/register" className="navbar__button">
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="navbar__user navbar__user--link">
                👤 {email}
              </Link>

              <Link to="/cart" className="navbar__cart">
                Cart
                {totalItems > 0 && <span>{totalItems}</span>}
              </Link>

              <button type="button" className="navbar__button" onClick={logout}>
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}