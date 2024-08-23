import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Checkout.css";

const validateForm = (formData, isRegistering) => {
  const errors = {};
  if (isRegistering) {
    if (!formData.nombre) errors.nombre = "Por favor, ingresá tu Nombre...";
    if (!formData.email) errors.email = "Por favor, ingresá tu Email...";
    if (formData.email !== formData.confirmEmail)
      errors.confirmEmail =
        "Los Correos Electrónicos ingresados tienen que coincidir...";
    if (!formData.telefono)
      errors.telefono = "Por favor, ingresá tu Número de Teléfono...";
    if (formData.contrasena.length < 8)
      errors.contrasena =
        "La Contraseña tiene que tener al menos 8 Carácteres...";
    if (formData.contrasena !== formData.confirmContrasena)
      errors.confirmContrasena = "Tus Contraseñas tienen que coincidir...";
  } else {
    if (!formData.email) errors.email = "Por favor, ingresá tu Email...";
    if (!formData.contrasena)
      errors.contrasena = "Por favor, ingresá tu Contraseña...";
  }
  return errors;
};

export const Checkout = () => {
  const { session, loginUser, register } = useAuth();
  const { courses, reservations, clear } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    confirmEmail: "",
    telefono: "",
    contrasena: "",
    confirmContrasena: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (session) navigate("/checkout");
  }, [session, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleShowPassword = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData, isRegistering);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);

    if (isRegistering) {
      handleRegistration()
        .then(() => {
          setModalMessage(
            "¡Creaste tu Cuenta con Éxito! ¿Estás listo/a para decodificar tu Cielo? ¡Ya estás dentro de tu Sesión!"
          );
          setModalType("success");
          setTimeout(() => navigate("/checkout"), 3500);
        })
        .catch(() => {
          setModalMessage("Hubo un Problema al querer Registrar tu Cuenta...");
          setModalType("error");
        })
        .finally(() => {
          setIsProcessing(false);
          setShowModal(true);
        });
    } else {
      handleLogin()
        .then(() => {
          setModalMessage("¡Iniciaste Exitosamente tu Sesión!");
          setModalType("success");
          setTimeout(() => navigate("/checkout"), 3000);
        })
        .catch(() => {
          setModalMessage("Mmm... este Email y/o Contraseña son Inválidos...");
          setModalType("error");
        })
        .finally(() => {
          setIsProcessing(false);
          setShowModal(true);
        });
    }
  };

  const handleRegistration = () => {
    return new Promise((resolve, reject) => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const isUserExists = existingUsers.some(
        (user) =>
          user.email === formData.email.toLowerCase() &&
          user.nombre === formData.nombre
      );

      if (isUserExists) {
        reject(
          "Mmm... Ya Existe una Cuenta con este mismo Nombre y/o Email..."
        );
      } else {
        existingUsers.push({
          nombre: formData.nombre,
          email: formData.email.toLowerCase(),
          telefono: formData.telefono,
          contrasena: formData.contrasena,
        });
        localStorage.setItem("users", JSON.stringify(existingUsers));

        register({
          nombre: formData.nombre,
          email: formData.email.toLowerCase(),
          telefono: formData.telefono,
          contrasena: formData.contrasena,
        })
          .then(() => {
            return loginUser({
              email: formData.email.toLowerCase(),
              contrasena: formData.contrasena,
            });
          })
          .then(() => resolve())
          .catch(() =>
            reject(
              "Mmm... Hubo un Error al querer Registrar tu Cuenta o Iniciar tu Sesión."
            )
          );
      }
    });
  };

  const handleLogin = () => {
    return new Promise((resolve, reject) => {
      loginUser({
        email: formData.email.toLowerCase(),
        contrasena: formData.contrasena,
      })
        .then((success) => {
          if (success) {
            resolve();
          } else {
            reject("Mmm... Hubo un Error al querer Iniciar tu Sesión...");
          }
        })
        .catch(() => reject("Error al Iniciar Sesión."));
    });
  };

  const handleCheckout = () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setModalMessage("Estamos Procesando tu Compra...");
    setModalType("info");
    setShowModal(true);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find((user) => user.email === session?.email);

    const orderData = {
      buyer: {
        name: session?.nombre || "Anónimo",
        phone: currentUser?.telefono || "Sin especificar...",
        email: session?.email || "Sin especificar...",
      },
      items: {
        cursos: courses.map((course) => ({
          id: course.id,
          title: course.title,
          price: course.price,
          quantity: course.quantity,
        })),
        reservas: reservations.map((reservation) => ({
          id: reservation.id,
          title: reservation.title,
          price: reservation.price,
          date: reservation.date,
          time: reservation.time,
        })),
      },
      total: cartTotal,
      date: new Date(),
    };

    addDoc(collection(db, "ItemCollectionII"), orderData)
      .then((docRef) => {
        setModalMessage(
          `¡Realizaste tu Compra con Éxito! Tu N° de Orden de Pedido es ${docRef.id}. ¡Gracias por Confiar y Elegir Código 3.11!`
        );
        setModalType("success");
        clear();
        setTimeout(() => navigate("/"), 5000);
      })
      .catch(() => {
        setModalMessage(
          "Mmm... Hubo un Problema al querer Efectuar tu Pedido... ¡Inténtalo otra vez!"
        );
        setModalType("error");
      })
      .finally(() => {
        setIsProcessing(false);
        setShowModal(true);
      });
  };

  const cartTotal =
    courses.reduce((acc, course) => acc + course.price * course.quantity, 0) +
    reservations.reduce((acc, reservation) => acc + reservation.price, 0);

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container">
      <div className="checkout-card">
        <h1 className="checkout-card-title">Finalizar Compra</h1>
        {session ? (
          <>
            {courses.length === 0 && reservations.length === 0 ? (
              <p className="text-center">Tu Carrito está Vacío...</p>
            ) : (
              <>
                {courses.length > 0 && (
                  <div className="titulo">
                    <h2>Cursos Seleccionados</h2>
                    <ul className="list-unstyled">
                      {courses.map((course) => {
                        const subtotal = course.price * course.quantity;
                        return (
                          <li key={course.id} className="checkout-item">
                            <div>
                              <h3>{course.title}</h3>
                              <p>Precio: ${course.price}</p>
                              <p>Cantidad: {course.quantity}</p>
                              <p>Subtotal: ${subtotal}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {reservations.length > 0 && (
                  <div className="titulo">
                    <h2>Reservas Seleccionadas</h2>
                    <ul className="list-unstyled">
                      {reservations.map((reservation) => (
                        <li key={reservation.id} className="checkout-item">
                          <div>
                            <h3>{reservation.title}</h3>
                            <p>Precio: ${reservation.price}</p>
                            <p>Fecha: {reservation.date}</p>
                            <p>Hora: {reservation.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <h2>Total: ${cartTotal}</h2>
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Compra"}
                </Button>
              </>
            )}
          </>
        ) : (
          <Form onSubmit={handleSubmit} noValidate>
            {isRegistering && (
              <Form.Group controlId="nombre" className="mb-3">
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
            )}
            <Form.Group controlId="email" className="mb-3">
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
            {isRegistering && (
              <Form.Group controlId="confirmEmail" className="mb-3">
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
            )}
            {isRegistering && (
              <Form.Group controlId="telefono" className="mb-3">
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
            )}
            <Form.Group
              controlId="contrasena"
              className="mb-3 password-container"
            >
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
            {isRegistering && (
              <Form.Group
                controlId="confirmContrasena"
                className="mb-3 password-container"
              >
                <Form.Label>Confirmar Contraseña</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={formData.showPassword ? "text" : "password"}
                    name="confirmContrasena"
                    value={formData.confirmContrasena}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmContrasena}
                    className="password-input"
                  />
                  <div className="password-toggle" onClick={handleShowPassword}>
                    {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.confirmContrasena}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={isProcessing}>
              {isProcessing
                ? "Procesando..."
                : isRegistering
                ? "Registrarme"
                : "Iniciar Sesión"}
            </Button>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "¿Ya tenés tu Cuenta? Iniciá Sesión"
                : "¿Todavía no tenés tu Cuenta? Regístrate"}
            </Button>
          </Form>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "success" ? "¡Todo un Éxito!" : "Mmm..."}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
