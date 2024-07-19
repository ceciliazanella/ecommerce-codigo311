import cartIcon from "../assets/cart.svg";
import "./CartWidget.css";

export const CartWidget = ({ quantity }) => {
  return (
    <div className="cart-icon">
      <img
        src={cartIcon}
        alt="Ícono de Carrito de Compras"
        className="cart-icon"
      />
      <span className="cart-notification">{quantity}</span>
    </div>
  );
};
