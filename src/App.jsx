import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartContextProvider, useCart } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { NavBar } from "./components/NavBar";
import { ItemListContainer } from "./components/ItemListContainer";
import { ItemDetailContainer } from "./components/ItemDetailContainer";
import { CrearCuenta } from "./components/CrearCuenta";
import { Ingresar } from "./components/Ingresar";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Home } from "./components/Home";
import { Footer } from "./components/Footer";
import { NotFound } from "./components/NotFound";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../src/theme";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const { cartQuantity, cartVisible, toggleCartVisibility } = useCart();

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartContextProvider>
          <BrowserRouter>
            <header>
              <NavBar
                toggleCart={toggleCartVisibility}
                cartQuantity={cartQuantity}
              />
            </header>
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<ItemListContainer />} />
                <Route path="/item/:id" element={<ItemDetailContainer />} />
                <Route path="/crearcuenta" element={<CrearCuenta />} />
                <Route path="/ingresar" element={<Ingresar />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {cartVisible && <Cart />}
            <footer>
              <Footer />
            </footer>
          </BrowserRouter>
        </CartContextProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
