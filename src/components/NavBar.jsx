import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBolt } from "@fortawesome/free-solid-svg-icons";
import { CartWidget } from "./CartWidget";
import logo from "../assets/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/NavBar.css";

export const NavBar = ({ toggleCart }) => {
  const { courses } = useCart();
  const { session, logout } = useAuth();

  const cartCount = courses.reduce(
    (total, course) => total + course.quantity,
    0
  );

  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <header>
      <Navbar expand="lg" className="navbar-custom">
        <Navbar.Brand>
          <NavLink to="/">
            <img
              src={logo}
              alt="Logo de Código 3.11 Astrología Evolutiva"
              className="navbar-logo"
            />
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link as={NavLink} to="/" className={linkClass}>
              Home
            </Nav.Link>
            <NavDropdown title="Servicios" id="basic-nav-dropdown">
              <NavDropdown.Item
                as={NavLink}
                to="category/consultoria"
                className={linkClass}
              >
                Consultoría Astrológica
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="category/cursos"
                className={linkClass}
              >
                Cursos On Demand
              </NavDropdown.Item>
            </NavDropdown>
            {session ? (
              <>
                <Nav.Link className="navbar-user-name">
                  ¡Hola, {session.nombre}!
                </Nav.Link>
                <Nav.Link onClick={logout} className={linkClass}>
                  CERRAR MI SESIÓN
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/crearcuenta" className={linkClass}>
                  Crear Cuenta
                  <FontAwesomeIcon icon={faStar} className="star-icon" />
                </Nav.Link>
                <Nav.Link as={NavLink} to="/ingresar" className={linkClass}>
                  Ingresar
                  <FontAwesomeIcon icon={faBolt} className="bolt-icon" />
                </Nav.Link>
              </>
            )}
            <CartWidget count={cartCount} toggleCart={toggleCart} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
