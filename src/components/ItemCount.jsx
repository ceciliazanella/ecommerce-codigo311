import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCount.css";

export const ItemCount = ({ stock, initial, item, onClose = () => {} }) => {
  const { addToCart, removeItem, isProductInCart, courses } = useCart();
  const [quantity, setQuantity] = useState(initial);
  const [availableStock, setAvailableStock] = useState(stock);

  useEffect(() => {
    console.log(`Servicios: ${JSON.stringify(item)}`);
    console.log(`Curso: ${JSON.stringify(courses)}`);

    const cartItem = courses.find((course) => course.id === item.id);
    console.log(`Curso Encontrado: ${JSON.stringify(cartItem)}`);

    setAvailableStock(cartItem ? stock - cartItem.quantity : stock);
    setQuantity(cartItem ? cartItem.quantity : initial);
  }, [courses, item.id, stock, initial]);

  const handleIncrement = () => {
    console.log(`Intentando Sumar Cantidad: ${quantity}`);
    if (availableStock > 0 && quantity < availableStock) {
      setQuantity((prev) => {
        const newQuantity = prev + 1;
        console.log(
          `Actualización de Estado después de Sumar Cantidad: ${newQuantity}`
        );
        return newQuantity;
      });
    }
  };

  const handleDecrement = () => {
    console.log(`Intentando Restar Cantidad: ${quantity}`);
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        console.log(
          `Actualización de Estado después de Restar Cantidad: ${newQuantity}`
        );
        return newQuantity;
      });
    }
  };

  const handleAddToCartClick = () => {
    console.log(
      `Intentando Agregar al Carrito: ${quantity} Unidad/es de ${item.title}`
    );
    if (availableStock > 0 && quantity > 0) {
      addToCart(item, quantity);
      Swal.fire({
        title: "¡Agregado al Carrito!",
        text: `Se Agregaron ${quantity} Unidad/es de ${item.title} a tu Carrito.`,
        icon: "success",
      }).then(() => {
        console.log(`Curso Agregado al Carrito: ${item.title}`);
        onClose();
      });
    } else {
      Swal.fire({
        title: "¡Sin Stock!",
        text: `No hay Stock Disponible de ${item.title} para Agregar a tu Carrito.`,
        icon: "error",
      });
    }
  };

  const handleRemoveFromCart = () => {
    console.log(`Intentando Eliminar del Carrito: ${item.title}`);
    removeItem(item.id, "cursos");
    Swal.fire({
      title: "¡Eliminado del Carrito!",
      text: `${item.title} se Eliminó de tu Carrito.`,
      icon: "info",
    }).then(() => {
      console.log(`Curso Eliminado del Carrito: ${item.title}`);
      onClose();
    });
  };

  return (
    <div className="item-count">
      {isProductInCart(item.id, "cursos") ? (
        <>
          <p className="in-cart-message">¡Este Curso está en tu Carrito!</p>
          <button className="btn btn-danger" onClick={handleRemoveFromCart}>
            Eliminar del Carrito
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
            Agregar al Carrito
          </button>
        </>
      )}
    </div>
  );
};
