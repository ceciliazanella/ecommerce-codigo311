import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { ItemCount } from "./ItemCount";
import { ItemCalendar } from "./ItemCalendar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetail.css";

const addLineBreaks = (text) =>
  text.split(".").map((part, index, arr) => (
    <React.Fragment key={index}>
      {part}
      {index < arr.length - 1 && (
        <>
          .<br />
        </>
      )}
    </React.Fragment>
  ));

export const ItemDetail = ({ item, onClose }) => {
  const { courses } = useCart();
  const [stock, setStock] = useState(item?.stock || 0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      const cartItem = courses.find((course) => course.id === item.id);
      setStock(cartItem ? item.stock - cartItem.quantity : item.stock);
    }
  }, [item, courses]);

  const handleAddToCart = (quantity) => {
    setModalContent({
      title: "¡Agregado con Éxito a tu Carrito!",
      text: `Se Agregaron ${quantity} Unidad/es de ${item.title} a tu Carrito.`,
      variant: "success",
    });
    setShowModal(true);
  };

  const processedDescription = useMemo(
    () => (item ? addLineBreaks(item.description) : null),
    [item]
  );

  const renderItemDetails = useMemo(() => {
    if (!item) return null;

    return (
      <div className="item-info">
        <p className="item-description">{processedDescription}</p>
        <h3 className="item-price">Precio: ${item.price}</h3>
        {item.categoryId === "cursos" ? (
          <>
            <p>Unidades Disponibles: {stock}</p>
            <ItemCount
              stock={stock}
              initial={1}
              item={item}
              onClose={onClose}
              onAddToCart={handleAddToCart}
            />
          </>
        ) : item.categoryId === "consultoria" ? (
          <ItemCalendar item={item} onClose={onClose} />
        ) : null}
      </div>
    );
  }, [item, stock, processedDescription, onClose]);

  return item ? (
    <>
      <h2 className="item-title">{item.title}</h2>
      <div className="item-detail">
        <div className="item-image-container">
          <img src={item.imageId} alt={item.title} className="item-image" />
        </div>
        {renderItemDetails}
      </div>
      <Button onClick={() => navigate(-1)} className="btn-volver">
        Volver
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : (
    <p>Detalles no encontrados...</p>
  );
};
