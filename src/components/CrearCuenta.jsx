import React from "react";
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
    .required("Tenés que Ingresar tu Nombre..."),
  email: Yup.string()
    .email("Este Email no es Válido...")
    .required("Tenés que Ingresar tu Email..."),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email"), null], "Tus Correos Electrónicos no coinciden...")
    .required("Tenés que Reconfirmar tu Email..."),
  telefono: Yup.string()
    .matches(
      /^[0-9]{10}$/,
      "Tu Teléfono tiene que ser un Número de 10 Dígitos..."
    )
    .required("Tenés que Ingresar tu Teléfono..."),
  contrasena: Yup.string()
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Tu Contraseña tiene que tener al menos 8 Carácteres, una Letra Mayúscula y un Número..."
    )
    .required("Tenés que Ingresar tu Contraseña..."),
});

export const CrearCuenta = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <div
      className="container mt-5"
      style={{ textAlign: "center", fontFamily: "Montserrat" }}
    >
      <Typography variant="h1" gutterBottom>
        Crear Cuenta
      </Typography>
      <Formik
        initialValues={{
          nombre: "",
          email: "",
          confirmEmail: "",
          telefono: "",
          contrasena: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const errorMessage = register(values);
          if (errorMessage) {
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            setSubmitting(false);
            return;
          }

          setSnackbarMessage(
            "¡La Creación de tu Cuenta fue todo un Éxito! Ahora estás a un paso de Conectar con el Código de tu Cielo... ¡Te acompañamos a Iniciar tu Sesión!"
          );
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          setTimeout(() => {
            navigate("/ingresar");
          }, 8000);
          setSubmitting(false);
        }}
      >
        {({ errors, touched }) => (
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
              className="vibrate-button"
            >
              Crear tu Cuenta
            </Button>
          </FormikForm>
        )}
      </Formik>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
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
            backgroundColor: "#fffff",
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
