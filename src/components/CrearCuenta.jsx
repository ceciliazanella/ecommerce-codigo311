import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CrearCuenta.css";

export const CrearCuenta = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    confirmEmail: "",
    telefono: "",
    contrasena: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShowPassword = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = "Tu Nombre tiene que tener al menos 2 Carácteres...";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Este Email no es Válido...";
    }

    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Tus Correos Electrónicos no coinciden...";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.telefono || !phoneRegex.test(formData.telefono)) {
      newErrors.telefono =
        "Tu Teléfono tiene que ser un Número de 10 Dígitos...";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!formData.contrasena || !passwordRegex.test(formData.contrasena)) {
      newErrors.contrasena =
        "Tu Contraseña tiene que tener al menos 8 Carácteres, una Letra Mayúscula y un Número...";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const errorMessage = register(formData);
      if (errorMessage) {
        setModalMessage(errorMessage);
        setModalType("error");
        setShowModal(true);
        return;
      }

      setModalMessage(
        "¡La Creación de tu Cuenta fue todo un Éxito! Ahora estás a un paso de Conectar con el Código de tu Cielo... ¡Te acompañamos a Iniciar tu Sesión!"
      );
      setModalType("success");
      setShowModal(true);
      setTimeout(() => {
        navigate("/ingresar");
      }, 3500);
      setFormData({
        nombre: "",
        email: "",
        confirmEmail: "",
        telefono: "",
        contrasena: "",
        showPassword: false,
      });
      setErrors({});
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5">
      <h1>Crear Cuenta</h1>
      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            isInvalid={!!errors.nombre}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nombre}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="confirmEmail">
          <Form.Label>Confirmar Email</Form.Label>
          <Form.Control
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            isInvalid={!!errors.confirmEmail}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmEmail}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="telefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            isInvalid={!!errors.telefono}
          />
          <Form.Control.Feedback type="invalid">
            {errors.telefono}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="contrasena">
          <Form.Label>Contraseña</Form.Label>
          <div className="input-group">
            <Form.Control
              type={formData.showPassword ? "text" : "password"}
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              isInvalid={!!errors.contrasena}
              className="password-input"
            />
            <div className="password-toggle" onClick={handleShowPassword}>
              {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.contrasena}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary">
          Crear tu Cuenta
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "error" ? "Mmm... Error" : "¡Un Éxito!"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
