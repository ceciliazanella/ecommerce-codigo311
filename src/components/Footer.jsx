import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-text">
            <p>
              Creo en la astrología como herramienta de cambio y aprendizaje
              entre las personas, como un medio de profunda transformación.
            </p>
            <p>
              Mi fin es crear un portal de autoconocimiento a través de un
              lenguaje que nos permita conectarnos con una realidad más sutil;
              desplegando el alma hacia la sabiduría y sus múltiples formas.
            </p>
            <span className="bold-text">© Cecilia Zanella 2023</span>
          </div>
          <div className="footer-icons">
            <a
              href="https://www.instagram.com/codigo3.11astrologia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
            </a>
            <a
              href="https://wa.me/1161528056"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="footer-icon" />
            </a>
            <a href="mailto:cielodejupiter22@gmail.com" aria-label="Email">
              <FontAwesomeIcon icon={faEnvelope} className="footer-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
