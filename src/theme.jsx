import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    h1: {
      margin: "2rem 0",
      padding: "0rem",
      fontFamily: "Caveat",
      color: "#1C6E8C",
      fontSize: "2.5rem",
      textShadow: "1px 1px 2px #000000",
      fontWeight: 600,
      fontStyle: "normal",
      textTransform: "capitalize",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "2rem auto",
          padding: "1rem 4rem",
          boxShadow: "2px 1.5px 5px #00000 !important",
          borderRadius: "0.5rem 2rem 1rem 1.5rem",
          border: "solid 2px #D0CCD0",
          fontFamily: "Montserrat",
          color: "#D0CCD0",
          fontSize: "1rem",
          textShadow: "1px 1px 2px #000000",
          fontWeight: 600,
          fontStyle: "normal",
          textTransform: "none",
          textAlign: "center",
          display: "block",
          transition: "all 0.6s ease-in",
        },
        containedPrimary: {
          backgroundColor: "#36213E",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#907F9F",
            border: "solid 4px #D0CCD0",
            boxShadow: "none",
            color: "#36213E !important",
            textShadow: "none !important",
            fontWeight: 800,
            textTransform: "uppercase",
            transition: "all 0.3s ease-out",
          },
          "&:disable": {
            color: "#907F9F !important",
            textShadow: "none !important",
          },
        },
        containedSecondary: {
          padding: "1rem",
          backgroundColor: "#D0CCD0",
          boxShadow: "0 0 5px #36213E",
          color: "#907F9F",
          textShadow: "none",
          "&:hover": {
            backgroundColor: "#36213E",
            border: "solid 4px #D0CCD0",
            boxShadow: "none",
            color: "#D0CCD0 !important",
            textShadow: "none !important",
            fontWeight: 800,
            textTransform: "uppercase",
            transition: "all 0.3s ease-out",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            "& input": {
              padding: "1.3rem",
              borderRadius: "1rem 2.5rem 1.5rem 1.2rem",
              fontFamily: "Montserrat",
              color: "#60495A",
              fontSize: "1rem",
              fontStyle: "italic",
              fontWeight: 600,
              transition: "all 0.3s ease",
            },
            "&.Mui-focused input": {
              fontSize: "1rem",
              transform: "translateY(-4px)",
            },
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "1rem 2.5rem 1.5rem 1.2rem",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "#63768D",
              borderWidth: "3px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#Cc9933",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          padding: "0.2rem",
          backgroundColor: "#ffff",
          borderRadius: "5%",

          fontFamily: "Montserrat",
          color: "#1C6E8C",
          fontSize: "0.8rem",
          fontWeight: 600,
          fontStyle: "italic",
          transform: "translateY(-10px)",
          transition: "all 0.8s ease-in",
          "&.Mui-focused": {
            fontSize: "1.1rem",
            color: "#274156",
            textShadow: "1.5px 1.5px 3px #0000",
            fontStyle: "normal",
            fontWeight: 700,
            transform: "translateY(-20px)",
            transition: "all 0.3s ease-out",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          padding: "1rem !important",
          fontFamily: "Montserrat !important",
          fontSize: "0.8rem !important",
          fontStyle: "italic !important",
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "1.2rem 2rem",
          color: "#36213E",
          boxShadow: "1px 1px 5px #00000",
        },
      },
    },
  },
});
