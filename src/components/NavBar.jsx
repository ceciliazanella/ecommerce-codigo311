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

  const cartCount = courses.reduce((acc, course) => acc + course.quantity, 0);

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
            <Nav.Link
              as={NavLink}
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </Nav.Link>
            <NavDropdown
              title="Servicios"
              id="basic-nav-dropdown"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <NavDropdown.Item
                as={NavLink}
                to="category/consultoria"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Consultoría Astrológica
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to="category/cursos"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Cursos On Demand
              </NavDropdown.Item>
            </NavDropdown>
            {session ? (
              <>
                <Nav.Link className="navbar-user-name">
                  ¡Hola, {session.nombre}!
                </Nav.Link>
                <Nav.Link onClick={logout} className="nav-link-close">
                  Cerrar mi Sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/crearcuenta"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Crear Cuenta
                  <FontAwesomeIcon icon={faStar} className="star-icon" />
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/ingresar"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
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
