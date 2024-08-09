import { useEffect, useState } from "react";
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
    const total = courseQuantity + reservationQuantity;

    console.log(`Cantidad Total Calculada: ${total}`);
    return total;
  };

  useEffect(() => {
    const totalQuantity = calculateTotalQuantity();
    setShowNotification(totalQuantity > 0);
    console.log(`Mostrar Notificación: ${totalQuantity > 0}`);
  }, [courses, reservations]);

  const totalQuantity = calculateTotalQuantity();

  return (
    <div
      className="cart-widget"
      onClick={() => {
        console.log("Carrito Abierto.");
        toggleCart();
      }}
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
