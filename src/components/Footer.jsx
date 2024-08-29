import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Footer.css";

const footerContent = {
  text: [
    "Creo en la astrología como herramienta de cambio y aprendizaje entre las personas, como un medio de profunda transformación.",
    "Mi fin es crear un portal de autoconocimiento a través de un lenguaje que nos permita conectarnos con una realidad más sútil; desplegando el alma hacia la sabiduría y sus múltiples formas.",
  ],
  links: [
    {
      href: "https://www.instagram.com/codigo3.11astrologia/",
      icon: faInstagram,
      ariaLabel: "Instagram",
    },
    {
      href: "https://wa.me/1161528056",
      icon: faWhatsapp,
      ariaLabel: "WhatsApp",
    },
    {
      href: "mailto:cielodejupiter22@gmail.com",
      icon: faEnvelope,
      ariaLabel: "Email",
    },
  ],
  copyright: "© Cecilia Zanella 2023",
};

export const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-text">
          {footerContent.text.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <span className="bold-text">{footerContent.copyright}</span>
        </div>
        <div className="footer-icons">
          {footerContent.links.map(({ href, icon, ariaLabel }) => (
            <a
              key={ariaLabel}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
            >
              <FontAwesomeIcon icon={icon} className="footer-icon" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
