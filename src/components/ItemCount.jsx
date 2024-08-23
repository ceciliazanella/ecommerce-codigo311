import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCount.css";

export const ItemCount = ({ stock, initial, item, onClose = () => {} }) => {
  const { addToCart, removeItem, isProductInCart, courses } = useCart();
  const [quantity, setQuantity] = useState(initial);
  const [availableStock, setAvailableStock] = useState(stock);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    const cartItem = courses.find(({ id }) => id === item.id);
    if (cartItem) {
      setAvailableStock(stock - cartItem.quantity);
      setQuantity(cartItem.quantity);
    } else {
      setAvailableStock(stock);
      setQuantity(initial);
    }
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
      setModalContent({
        title: "¡Agregado con Éxito a tu Carrito!",
        text: `Se Agregaron ${quantity} Unidad/es de ${item.title} a tu Carrito.`,
        variant: "success",
      });
    } else {
      setModalContent({
        title: "Ouch... ¡Sin Stock!",
        text: `No hay Stock Disponible de ${item.title} para Agregar a tu Carrito...`,
        variant: "danger",
      });
    }
    setShowModal(true);
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id, "cursos");
    setModalContent({
      title: "¡Eliminado de tu Carrito!",
      text: `${item.title} se Eliminó de tu Carrito.`,
      variant: "info",
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    onClose();
  };

  const isItemInCart = isProductInCart(item.id, "cursos");

  return (
    <div className="item-count">
      {isItemInCart ? (
        <>
          <p className="in-cart-message">
            ¡Este Curso ahora está en tu Carrito!
          </p>
          <Button className="btn btn-danger" onClick={handleRemoveFromCart}>
            Eliminar de mi Carrito
          </Button>
        </>
      ) : (
        <>
          <div className="quantity-controls">
            <Button
              className={`btn-custom ${quantity <= 1 ? "disabled" : ""}`}
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button
              className={`btn-custom ${availableStock <= 0 ? "disabled" : ""}`}
              onClick={handleIncrement}
              disabled={availableStock <= 0 || quantity >= availableStock}
            >
              +
            </Button>
          </div>
          <Button
            className="btn btn-primary"
            onClick={handleAddToCartClick}
            disabled={availableStock <= 0}
          >
            Agregar a mi Carrito
          </Button>
        </>
      )}

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
