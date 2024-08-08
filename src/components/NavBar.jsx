import React, { useState, useCallback } from "react";
import { CartWidget } from "./CartWidget";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBolt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/NavBar.css";

export const NavBar = ({ toggleCart }) => {
  const [activeLink, setActiveLink] = useState("");
  const { courses } = useCart();

  const cartCount = courses.reduce((acc, course) => acc + course.quantity, 0);

  const handleNavLinkClick = useCallback((link) => {
    setActiveLink(link);
  }, []);

  const navLinkClass = (linkName) =>
    `nav-link ${activeLink === linkName ? "active" : ""}`;

  return (
    <header>
      <Navbar expand="lg" className="navbar-custom">
        <Navbar.Brand>
          <Link to="/">
            <img
              src={logo}
              alt="Logo de Código 3.11 Astrología Evolutiva"
              className="navbar-logo"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={navLinkClass("Home")}
              onClick={() => handleNavLinkClick("Home")}
            >
              Home
            </Nav.Link>
            <NavDropdown
              title="Servicios"
              id="basic-nav-dropdown"
              className={navLinkClass("Servicios")}
            >
              <NavDropdown.Item
                as={Link}
                to="/consultoria"
                className={navLinkClass("Consultoría Astrológica")}
                onClick={() => handleNavLinkClick("Consultoría Astrológica")}
              >
                Consultoría Astrológica
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/cursos"
                className={navLinkClass("Cursos On Demand")}
                onClick={() => handleNavLinkClick("Cursos On Demand")}
              >
                Cursos On Demand
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              as={Link}
              to="/create-account"
              className={navLinkClass("Crear Cuenta")}
              onClick={() => handleNavLinkClick("Crear Cuenta")}
            >
              Crear Cuenta
              <FontAwesomeIcon icon={faStar} className="star-icon" />
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/login"
              className={navLinkClass("Ingresar")}
              onClick={() => handleNavLinkClick("Ingresar")}
            >
              Ingresar
              <FontAwesomeIcon icon={faBolt} className="bolt-icon" />
            </Nav.Link>
            <CartWidget count={cartCount} toggleCart={toggleCart} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
