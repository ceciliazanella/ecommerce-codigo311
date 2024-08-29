import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import cartIcon from "../assets/cart.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CartWidget.css";

const calculateTotalQuantity = (courses, reservations) => {
  const courseQuantity = courses.reduce((acc, item) => acc + item.quantity, 0);
  const reservationQuantity = reservations.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  return courseQuantity + reservationQuantity;
};

export const CartWidget = ({ toggleCart }) => {
  const { courses, reservations } = useCart();
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const quantity = calculateTotalQuantity(courses, reservations);
    setTotalQuantity(quantity);
  }, [courses, reservations]);

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
      {totalQuantity > 0 && (
        <span className="cart-notification">{totalQuantity}</span>
      )}
    </div>
  );
};
