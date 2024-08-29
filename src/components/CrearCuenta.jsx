import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/CrearCuenta.css";

const validationSchema = Yup.object({
  nombre: Yup.string()
    .min(2, "Tu Nombre tiene que tener al menos 2 Carácteres...")
    .required("Ingresá tu Nombre..."),
  email: Yup.string()
    .email("Este Email no es Válido...")
    .required("Ingresá tu Email..."),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email"), null], "Los Correos Electrónicos no Coinciden...")
    .required("Confirmá tu Email..."),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, "Tu Teléfono tiene que tener 10 Dígitos...")
    .required("Ingresá tu Número de Teléfono..."),
  contrasena: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Tu Contraseña tiene que tener al menos 8 Carácteres, una Letra Mayúscula y un Número..."
    )
    .required("Ingresá tu Contraseña..."),
});

const initialValues = {
  nombre: "",
  email: "",
  confirmEmail: "",
  telefono: "",
  contrasena: "",
};

export const CrearCuenta = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const errorMessage = await register(values);
      setSnackbar({
        open: true,
        message:
          errorMessage ||
          "¡Todo un Éxito! Ya Creaste tu Cuenta... ¿Estás Listo/a para Decodificar tu Cielo?",
        severity: errorMessage ? "error" : "success",
      });
      if (!errorMessage) {
        setTimeout(() => navigate("/ingresar"), 6000);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Mmm... Hubo un Error. Por favor, ¡Intentá Otra Vez!",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ textAlign: "center", fontFamily: "Montserrat" }}
    >
      <Typography variant="h1" gutterBottom>
        Crear Cuenta
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <FormikForm
            noValidate
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
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
              error={Boolean(errors.confirmEmail && touched.confirmEmail)}
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
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              fullWidth
              error={Boolean(errors.contrasena && touched.contrasena)}
              helperText={<ErrorMessage name="contrasena" />}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              className="vibrate-button"
            >
              Crear tu Cuenta
            </Button>
          </FormikForm>
        )}
      </Formik>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{
            width: "100%",
            margin: "0 auto",
            padding: "1rem",
            border: "solid 2px #D0CCD0",
            borderRadius: "2rem 1.5rem 1.5rem 2rem",
            boxShadow: "2px 3px 10px #36213E",
            fontFamily: "Montserrat",
            color: snackbar.severity === "success" ? "#4caf50" : "#f44336",
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
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
