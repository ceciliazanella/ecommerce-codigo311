import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import cartIcon from "../assets/cart.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CartWidget.css";

const calculateTotalQuantity = (courses, reservations) => {
  const courseQuantity =
    courses?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const reservationQuantity =
    reservations?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  return courseQuantity + reservationQuantity;
};

export const CartWidget = ({ toggleCart }) => {
  const { courses, reservations } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const totalQuantity = calculateTotalQuantity(courses, reservations);
    setShowNotification(totalQuantity > 0);
  }, [courses, reservations]);

  const totalQuantity = calculateTotalQuantity(courses, reservations);

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
