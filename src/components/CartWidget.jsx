import React, { useEffect, useState } from "react";
import cartIcon from "../assets/cart.svg";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CartWidget.css";

export const CartWidget = ({ toggleCart }) => {
  const { courses, reservations } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const calculateTotalQuantity = () => {
    const courseQuantity =
      courses?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const reservationQuantity =
      reservations?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    return courseQuantity + reservationQuantity;
  };

  useEffect(() => {
    const totalQuantity = calculateTotalQuantity();
    setShowNotification(totalQuantity > 0);

    document.title =
      totalQuantity > 0
        ? `(${totalQuantity}) Consultoría Astrológica`
        : `Código 3.11 | Astrología Evolutiva`;
  }, [courses, reservations]);

  const totalQuantity = calculateTotalQuantity();

  return (
    <div
      className="cart-widget"
      onClick={toggleCart}
      role="button"
      aria-label="Abrir Carrito"
    >
      <img
        src={cartIcon}
        alt="Ícono de Carrito de Compras"
        className="cart-icon"
      />
      {showNotification && (
        <span className="cart-notification">{totalQuantity}</span>
      )}
    </div>
  );
};
