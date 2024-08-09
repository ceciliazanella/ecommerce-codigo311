import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ItemListContainer } from "./components/ItemListContainer";
import { ItemDetailContainer } from "./components/ItemDetailContainer";
import { CartContextProvider } from "./context/CartContext";
import { Cart } from "./components/Cart";
import { Home } from "./components/Home";
import { Footer } from "./components/Footer";
import { NotFound } from "./components/NotFound";

function App() {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartVisible, setCartVisible] = useState(false);

  const addToCart = useCallback((count) => {
    setCartQuantity((prevQuantity) => prevQuantity + count);
  }, []);

  const toggleCartVisibility = useCallback(() => {
    setCartVisible((prevVisible) => !prevVisible);
  }, []);

  return (
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
            <Route
              path="/consultoria"
              element={
                <ItemListContainer
                  h1="Consultoría Astrológica"
                  category="consultoria"
                  addToCart={addToCart}
                />
              }
            />
            <Route
              path="/cursos"
              element={
                <ItemListContainer
                  h1="Cursos On Demand"
                  category="cursos"
                  addToCart={addToCart}
                />
              }
            />
            <Route path="/item/:id" element={<ItemDetailContainer />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {cartVisible && <Cart />}
        </main>
      </BrowserRouter>
      <Footer />
    </CartContextProvider>
  );
}

export default App;
