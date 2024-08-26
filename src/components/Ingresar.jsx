import React, { useState } from "react";
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

export const Ingresar = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { courses, reservations } = useCart();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div
      className="container mt-5"
      style={{ textAlign: "center", fontFamily: "Montserrat" }}
    >
      <Typography variant="h1" gutterBottom>
        Ingresar
      </Typography>
      <Formik
        initialValues={{
          email: "",
          contrasena: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const success = loginUser(values);
          if (success) {
            setSnackbarMessage(
              "¡Ya estás dentro de tu Sesión! ¿Preparado/a para decodificar tu Cielo?"
            );
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            setTimeout(() => {
              const hasItemsInCart =
                courses.length > 0 || reservations.length > 0;
              navigate(hasItemsInCart ? "/checkout" : "/");
            }, 4000);
          } else {
            setSnackbarMessage("Tu Email y/o Contraseña son Incorrectos...");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
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
              className="vibrate-button"
            >
              Ingresar
            </Button>
          </FormikForm>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={snackbarMessage}
        action={null}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            margin: "0 auto",
            padding: "1rem",
            backgroundColor: "#fffff",
            borderRadius: "2rem 1.5rem 1.5rem 2rem",
            border: "solid 2px #D0CCD0",
            boxShadow: "2px 3px 10px #36213E",
            fontFamily: "Montserrat",
            color: snackbarSeverity === "success" ? "#4caf50" : "#f44336",
            fontSize: "1rem",
            fontStyle: "italic",
            textShadow: "0.5px 0.5px 1px #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiAlert-message": {
              fontFamily: "Montserrat",
              textAlign: "center",
              flex: 1,
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
