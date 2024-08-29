import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Ingresar.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Este Email no es Válido...")
    .required("Por favor, Ingresá tu Email..."),
  contrasena: Yup.string().required("Por favor, Ingresá tu Contraseña..."),
});

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return { snackbar, openSnackbar, closeSnackbar };
};

export const Ingresar = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { courses, reservations } = useCart();
  const { snackbar, openSnackbar, closeSnackbar } = useSnackbar();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (values, { setSubmitting }) => {
    const success = loginUser(values);
    if (success) {
      openSnackbar(
        "¡Ya Estás en tu Sesión! ¿Preparado/a para Decodificar tu Cielo?",
        "success"
      );
      setTimeout(() => {
        navigate(courses.length || reservations.length ? "/checkout" : "/");
      }, 4000);
    } else {
      openSnackbar("Tu Email y/o Contraseña son Incorrectos...", "error");
    }
    setSubmitting(false);
  };

  return (
    <div
      className="container mt-5"
      style={{ textAlign: "center", fontFamily: "Montserrat" }}
    >
      <Typography variant="h1" gutterBottom>
        Ingresar
      </Typography>
      <Formik
        initialValues={{ email: "", contrasena: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <FormikForm
            noValidate
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
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
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              fullWidth
              error={Boolean(errors.contrasena && touched.contrasena)}
              helperText={<ErrorMessage name="contrasena" />}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
              Ingresar
            </Button>
          </FormikForm>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={closeSnackbar}
          sx={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "2rem 1.5rem 1.5rem 2rem",
            border: "solid 2px #D0CCD0",
            boxShadow: "2px 3px 10px #36213E",
            fontFamily: "Montserrat",
            color: snackbar.severity === "success" ? "#4caf50" : "#f44336",
            fontSize: "1rem",
            fontStyle: "italic",
            textShadow: "0.5px 0.5px 1px #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiAlert-message": {
              textAlign: "center",
              flex: 1,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
