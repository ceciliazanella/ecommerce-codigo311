import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCount.css";

export const ItemCount = ({ stock, initial, item, onClose = () => {} }) => {
  const { addToCart, removeItem, isProductInCart, courses } = useCart();
  const [quantity, setQuantity] = useState(initial);
  const [availableStock, setAvailableStock] = useState(stock);

  useEffect(() => {
    const cartItem = courses.find((course) => course.id === item.id);
    setAvailableStock(cartItem ? stock - cartItem.quantity : stock);
    setQuantity(cartItem ? cartItem.quantity : initial);
  }, [courses, item.id, stock, initial]);

  const handleIncrement = () => {
    if (availableStock > 0 && quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartClick = () => {
    if (availableStock > 0 && quantity > 0) {
      addToCart(item, quantity);
      Swal.fire({
        title: "¡Añadido al Carrito!",
        text: `Se añadieron ${quantity} unidad/es de ${item.title} a tu carrito.`,
        icon: "success",
      }).then(() => onClose());
    } else {
      Swal.fire({
        title: "¡Sin Stock!",
        text: `No hay stock disponible de ${item.title} para agregar a tu carrito.`,
        icon: "error",
      });
    }
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id, "cursos");
    Swal.fire({
      title: "¡Eliminado del Carrito!",
      text: `${item.title} se eliminó de tu carrito.`,
      icon: "info",
    }).then(() => onClose());
  };

  return (
    <div className="item-count">
      {isProductInCart(item.id, "cursos") ? (
        <>
          <p className="in-cart-message">Este curso está en tu carrito</p>
          <button className="btn btn-danger" onClick={handleRemoveFromCart}>
            Eliminar del carrito
          </button>
        </>
      ) : (
        <>
          <div className="quantity-controls">
            <button
              className={`btn-custom ${quantity <= 1 ? "disabled" : ""}`}
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className={`btn-custom ${availableStock <= 0 ? "disabled" : ""}`}
              onClick={handleIncrement}
              disabled={availableStock <= 0 || quantity >= availableStock}
            >
              +
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAddToCartClick}>
            Agregar al carrito
          </button>
        </>
      )}
    </div>
  );
};