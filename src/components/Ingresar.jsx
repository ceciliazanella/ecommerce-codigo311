import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Ingresar.css";

export const Ingresar = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    contrasena: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { courses, reservations } = useCart();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowPassword = () => {
    setLoginData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = "Por favor, ingresá tu Email...";
    if (!loginData.contrasena)
      newErrors.contrasena = "Por favor, ingresá tu Contraseña...";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = loginUser(loginData);
      if (success) {
        setModalMessage(
          "¡Ya estás dentro de tu Sesión! ¿Preparado/a para decodificar tu Cielo?"
        );
        setModalType("success");
        setTimeout(() => {
          const hasItemsInCart = courses.length > 0 || reservations.length > 0;
          navigate(hasItemsInCart ? "/checkout" : "/");
        }, 2000);
      } else {
        setModalMessage("Tu Email y/o Contraseña son Incorrectos...");
        setModalType("error");
      }
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <h1>Ingresar</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <div className="input-group">
            <Form.Control
              type={loginData.showPassword ? "text" : "password"}
              name="contrasena"
              value={loginData.contrasena}
              onChange={handleChange}
              isInvalid={!!errors.contrasena}
              className="password-input"
            />
            <div className="password-toggle" onClick={handleShowPassword}>
              {loginData.showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.contrasena}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">
          Ingresar
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "success" ? "¡Todo un Éxito!" : "Mmm..."}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>
    </div>
  );
};
