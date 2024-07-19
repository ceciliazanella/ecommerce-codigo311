import React, { useState } from "react";
import { CartWidget } from "./CartWidget";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBolt } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.svg";
import "./NavBar.css";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("");

  const handleNavLinkClick = (link) => {
    setActiveLink(link);
  };

  const navLinkClass = (linkName) =>
    `nav-link ${activeLink === linkName ? "active" : ""}`;

  const navItemStyle = (linkName) => ({
    color: activeLink === linkName ? "#36213E" : "#63768D",
  });

  return (
    <header>
      <Navbar expand="lg" className="navbar-custom">
        <Navbar.Brand>
          <img
            src={logo}
            alt="Logo de Código 3.11 Astrología Evolutiva"
            className="navbar-logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link
              href="#"
              className={navLinkClass("Home")}
              onClick={() => handleNavLinkClick("Home")}
              style={navItemStyle("Home")}
            >
              Home
            </Nav.Link>
            <NavDropdown
              title="Servicios"
              id="basic-nav-dropdown"
              className={`nav-link ${
                activeLink.startsWith("Servicios") ? "active" : ""
              }`}
            >
              <NavDropdown.Item
                href="#"
                className={`dropdown-item ${navLinkClass(
                  "Consultas Astrológicas"
                )}`}
                onClick={() => handleNavLinkClick("Consultas Astrológicas")}
                style={navItemStyle("Consultas Astrológicas")}
              >
                Consultas Astrológicas
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#"
                className={`dropdown-item ${navLinkClass("Cursos On Demand")}`}
                onClick={() => handleNavLinkClick("Cursos On Demand")}
                style={navItemStyle("Cursos On Demand")}
              >
                Cursos On Demand
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              href="#"
              className={navLinkClass("Crear Cuenta")}
              onClick={() => handleNavLinkClick("Crear Cuenta")}
              style={navItemStyle("Crear Cuenta")}
            >
              Crear Cuenta{" "}
              <FontAwesomeIcon icon={faStar} className="star-icon" />
            </Nav.Link>
            <Nav.Link
              href="#"
              className={navLinkClass("Ingresar")}
              onClick={() => handleNavLinkClick("Ingresar")}
              style={navItemStyle("Ingresar")}
            >
              Ingresar <FontAwesomeIcon icon={faBolt} className="bolt-icon" />
            </Nav.Link>
            <CartWidget quantity={9} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
