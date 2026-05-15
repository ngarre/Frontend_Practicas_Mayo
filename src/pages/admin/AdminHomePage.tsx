import { Link } from "react-router-dom";
import "../ProtectedPages.css";
import "./AdminHomePage.css";

export default function AdminHomePage() {
    return (
        <main className="protected-page">
            <div className="admin-home-floating admin-home-floating--one">📊</div>
            <div className="admin-home-floating admin-home-floating--two">👥</div>
            <div className="admin-home-floating admin-home-floating--three">🥗</div>
            <div className="admin-home-floating admin-home-floating--four">⚙️</div>

            <section className="protected-card">
                <div className="protected-card__eyebrow">Admin panel</div>
                <h1>Welcome to Cozy Bites admin</h1>
                <p>
                    Choose which area you want to manage: customers, orders insights or
                    the product catalog.
                </p>
            </section>

            <section className="admin-home-grid">
                <Link to="/admin/dashboard" className="admin-home-card">
                    <div className="admin-home-card__icon">👥</div>
                    <span className="admin-home-card__eyebrow">Customers</span>
                    <h2>Customer dashboard</h2>
                    <p>
                        Explore customer data, filter users, review newsletter subscribers
                        and manage customer accounts.
                    </p>
                </Link>

                <Link to="/admin/items" className="admin-home-card">
                    <div className="admin-home-card__icon">🥗</div>
                    <span className="admin-home-card__eyebrow">Products</span>
                    <h2>Product dashboard</h2>
                    <p>
                        Create, edit, delete and review Cozy Bites products with images,
                        prices and release dates.
                    </p>
                </Link>
            </section>
        </main>
    );
}