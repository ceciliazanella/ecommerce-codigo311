import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Checkout.css";

const registrationSchema = Yup.object({
  nombre: Yup.string().required("Por favor, Ingresá tu Nombre..."),
  email: Yup.string()
    .email("Este Correo Electrónico es Inválido...")
    .required("Por favor, Ingresá tu Email..."),
  confirmEmail: Yup.string()
    .oneOf(
      [Yup.ref("email"), null],
      "Los Correos Electrónicos tienen que Coincidir..."
    )
    .required("Por favor, Confirmá tu Email..."),
  telefono: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "El Número de Teléfono tiene que tener 10 Dígitos..."
    )
    .required("Por favor, Ingresá tu Número de Teléfono..."),
  contrasena: Yup.string()
    .min(8, "La Contraseña tiene que tener al menos 8 Carácteres...")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Tiene que tener al menos una Letra Mayúscula y un Número..."
    )
    .required("Por favor, Ingresá tu Contraseña..."),
  confirmContrasena: Yup.string()
    .oneOf(
      [Yup.ref("contrasena"), null],
      "Las Contraseñas tienen que Coincidir..."
    )
    .required("Por favor, Confirmá tu Contraseña..."),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Este Correo Eelectrónico es Inválido...")
    .required("Por favor, Ingresá tu Email..."),
  contrasena: Yup.string()
    .min(8, "La Contraseña tiene que tener al menos 8 Carácteres...")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Tiene que tener al menos una Letra Mayúscula y un Número..."
    )
    .required("Por favor, Ingresá tu Contraseña..."),
});

export const Checkout = () => {
  const { session, loginUser, register } = useAuth();
  const { courses, reservations, clearCart } = useCart();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (session) navigate("/checkout");
  }, [session, navigate]);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleClickShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleCloseSnackbar = useCallback(() => setOpenSnackbar(false), []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsProcessing(true);
      if (isRegistering) {
        await handleRegistration(values);
        setSnackbarMessage(
          "¡Tu Cuenta es todo un Éxito! Ya estás dentro de tu Sesión."
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/checkout"), 4000);
      } else {
        await handleLogin(values);
        setSnackbarMessage("¡Iniciaste tu Sesión Exitosamente!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/checkout"), 3000);
      }
    } catch (error) {
      setSnackbarMessage(error.message || "Mmmm... Error Desconocido...");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
      setIsProcessing(false);
    }
  };

  const handleRegistration = async (values) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const isUserExists = existingUsers.some(
      (user) =>
        user.email === values.email.toLowerCase() &&
        user.nombre === values.nombre
    );

    if (isUserExists) {
      throw new Error("Ya Existe una Cuenta con este Nombre y/o Email...");
    }

    existingUsers.push({
      nombre: values.nombre,
      email: values.email.toLowerCase(),
      telefono: values.telefono,
      contrasena: values.contrasena,
    });
    localStorage.setItem("users", JSON.stringify(existingUsers));

    await register({
      nombre: values.nombre,
      email: values.email.toLowerCase(),
      telefono: values.telefono,
      contrasena: values.contrasena,
    });

    await loginUser({
      email: values.email.toLowerCase(),
      contrasena: values.contrasena,
    });
  };

  const handleLogin = async (values) => {
    const success = await loginUser({
      email: values.email.toLowerCase(),
      contrasena: values.contrasena,
    });
    if (!success) {
      throw new Error("Este Email y/o Contraseña son Inválidos...");
    }
  };

  const handleCheckout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.email === session?.email.toLowerCase()
    );

    const userPhone = currentUser?.telefono || "Sin especificar...";

    const orderData = {
      buyer: {
        name: session?.nombre || "Anónimo",
        phone: userPhone,
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

    try {
      const docRef = await addDoc(collection(db, "Orders"), orderData);
      setSnackbarMessage(
        `¡Realizaste tu Compra con Éxito! Tu N° de Orden de Pedido es ${docRef.id} ¡Gracias por Confiar y Elegir Código 3.11!`
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      clearCart();
      setTimeout(() => navigate("/"), 6000);
    } catch {
      setSnackbarMessage(
        "Hubo un Error al intentar efectuar tu Compra... ¡Intentalo Otra Vez!"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotal =
    courses.reduce((acc, course) => acc + course.price * course.quantity, 0) +
    reservations.reduce((acc, reservation) => acc + reservation.price, 0);

  return (
    <div className="container">
      <div className="checkout-card">
        <Typography variant="h1" gutterBottom>
          Finalizar Compra
        </Typography>
        {session ? (
          <>
            {courses.length === 0 && reservations.length === 0 ? (
              <Typography variant="h6" align="center">
                Tu Carrito está Vacío...
              </Typography>
            ) : (
              <>
                {courses.length > 0 && (
                  <div className="titulo">
                    <Typography variant="h2">Cursos Seleccionados</Typography>
                    <ul className="list-unstyled">
                      {courses.map((course) => (
                        <li key={course.id} className="checkout-item">
                          <div>
                            <Typography variant="h3">{course.title}</Typography>
                            <Typography>Precio: ${course.price}</Typography>
                            <Typography>Cantidad: {course.quantity}</Typography>
                            <Typography>
                              Subtotal: ${course.price * course.quantity}
                            </Typography>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {reservations.length > 0 && (
                  <div className="titulo">
                    <Typography variant="h2">Reservas Seleccionadas</Typography>
                    <ul className="list-unstyled">
                      {reservations.map((reservation) => (
                        <li key={reservation.id} className="checkout-item">
                          <div>
                            <Typography variant="h3">
                              {reservation.title}
                            </Typography>
                            <Typography>
                              Precio: ${reservation.price}
                            </Typography>
                            <Typography>
                              Fecha: {reservation.date} - Hora:{" "}
                              {reservation.time}
                            </Typography>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Typography variant="h4">Total: ${cartTotal}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Compra"}
                </Button>
              </>
            )}
          </>
        ) : (
          <Formik
            initialValues={
              isRegistering
                ? {
                    nombre: "",
                    email: "",
                    confirmEmail: "",
                    telefono: "",
                    contrasena: "",
                    confirmContrasena: "",
                  }
                : {
                    email: "",
                    contrasena: "",
                  }
            }
            validationSchema={isRegistering ? registrationSchema : loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <FormikForm noValidate>
                {isRegistering ? (
                  <>
                    <Field
                      name="nombre"
                      as={TextField}
                      label="Nombre"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.nombre && touched.nombre)}
                      helperText={<ErrorMessage name="nombre" />}
                    />
                    <Field
                      name="email"
                      as={TextField}
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.email && touched.email)}
                      helperText={<ErrorMessage name="email" />}
                    />
                    <Field
                      name="confirmEmail"
                      as={TextField}
                      label="Confirmar Email"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={Boolean(
                        errors.confirmEmail && touched.confirmEmail
                      )}
                      helperText={<ErrorMessage name="confirmEmail" />}
                    />
                    <Field
                      name="telefono"
                      as={TextField}
                      label="Teléfono"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.telefono && touched.telefono)}
                      helperText={<ErrorMessage name="telefono" />}
                    />
                    <Field
                      name="contrasena"
                      as={TextField}
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={Boolean(errors.contrasena && touched.contrasena)}
                      helperText={<ErrorMessage name="contrasena" />}
                    />
                    <Field
                      name="confirmContrasena"
                      as={TextField}
                      label="Confirmar Contraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={Boolean(
                        errors.confirmContrasena && touched.confirmContrasena
                      )}
                      helperText={<ErrorMessage name="confirmContrasena" />}
                    />
                  </>
                ) : (
                  <>
                    <Field
                      name="email"
                      as={TextField}
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.email && touched.email)}
                      helperText={<ErrorMessage name="email" />}
                    />
                    <Field
                      name="contrasena"
                      as={TextField}
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={Boolean(errors.contrasena && touched.contrasena)}
                      helperText={<ErrorMessage name="contrasena" />}
                    />
                  </>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isProcessing || !isValid || !dirty}
                >
                  {isProcessing
                    ? "Procesando..."
                    : isRegistering
                    ? "Registrarme"
                    : "Iniciar Sesión"}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setIsRegistering(!isRegistering)}
                  color="secondary"
                >
                  {isRegistering
                    ? "¿Ya tenés tu Cuenta? Iniciá Sesión"
                    : "¿No tenés una Cuenta? Registrate"}
                </Button>
              </FormikForm>
            )}
          </Formik>
        )}
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            margin: "0 auto",
            padding: "1rem",
            border: "solid 2px #D0CCD0",
            borderRadius: "2rem 1.5rem 1.5rem 2rem",
            boxShadow: "2px 3px 10px #36213E",
            fontFamily: "Montserrat",
            color: snackbarSeverity === "success" ? "#4caf50" : "#f44336",
            fontSize: "1rem",
            fontStyle: "italic",
            textShadow: "0.5px 0.5px 1px #000000",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiAlert-message": {
              fontFamily: "Montserrat",
              textAlign: "center",
              flex: 1,
            },
            "& .MuiAlert-action": {
              display: "none",
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
