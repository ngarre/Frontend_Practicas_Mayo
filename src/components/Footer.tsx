import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <img
            src="/images/branding/cozy-bites-logo-horizontal-transparent.png"
            alt="Cozy Bites"
            className="footer__logo"
          />

          <p>
            Healthy food, cozy mood. Fresh bowls, mindful bites and soft moments
            made with love.
          </p>
        </div>

        <div className="footer__sections">
          <div>
            <h3>Menu</h3>
            <span>Fresh bowls</span>
            <span>Smoothies</span>
            <span>Mindful snacks</span>
          </div>

          <div>
            <h3>Experience</h3>
            <span>Cozy delivery</span>
            <span>Healthy choices</span>
            <span>Made with care</span>
          </div>
        </div>
      </div>

      <div className="footer__credits">
        Miguel Ángel Rubio, Néstor Allepuz y Natalia Garré · Prácticas Mayo 2026
      </div>
    </footer>
  );
}