import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
