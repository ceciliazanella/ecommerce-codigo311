import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCount.css";

const Modal_Content = {
  success: {
    title: "¡Agregado con Éxito a tu Carrito!",
    variant: "success",
  },
  outOfStock: {
    title: "Ouch... ¡Sin Stock!",
    variant: "danger",
  },
  removed: {
    title: "Eliminado de tu Carrito",
    variant: "info",
  },
};

export const ItemCount = ({ stock, initial, item, onClose = () => {} }) => {
  const { addToCart, removeItem, isProductInCart, courses } = useCart();
  const [quantity, setQuantity] = useState(initial);
  const [availableStock, setAvailableStock] = useState(stock);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    const cartItem = courses.find(({ id }) => id === item.id);
    setAvailableStock(cartItem ? stock - cartItem.quantity : stock);
    setQuantity(cartItem ? cartItem.quantity : initial);
  }, [courses, item.id, stock, initial]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.min(Math.max(prev + change, 1), availableStock));
  };

  const handleAddToCart = () => {
    if (availableStock > 0 && quantity > 0) {
      addToCart(item, quantity);
      setModalContent({
        ...Modal_Content.success,
        text: `Se Agregaron ${quantity} Unidad/es de ${item.title} a tu Carrito.`,
      });
    } else {
      setModalContent({
        ...Modal_Content.outOfStock,
        text: `No hay Stock Disponible de ${item.title} para Agregar a tu Carrito...`,
      });
    }
    setShowModal(true);
  };

  const handleRemoveFromCart = () => {
    removeItem(item.id, "cursos");
    setModalContent({
      ...Modal_Content.removed,
      text: `${item.title} se Eliminó de tu Carrito.`,
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
          <Button variant="danger" onClick={handleRemoveFromCart}>
            Eliminar de mi Carrito
          </Button>
        </>
      ) : (
        <>
          <div className="quantity-controls">
            <Button
              className="btn-custom"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button
              className="btn-custom"
              onClick={() => handleQuantityChange(1)}
              disabled={availableStock <= 0 || quantity >= availableStock}
            >
              +
            </Button>
          </div>
          <Button
            className="btn btn-primary"
            onClick={handleAddToCart}
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
