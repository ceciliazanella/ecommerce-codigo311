import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Cart.css";

export const Cart = () => {
  const {
    courses,
    reservations,
    cancelReservation,
    removeItem,
    updateCartItem,
    clear,
  } = useContext(CartContext);

  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [actionType, setActionType] = useState("");
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const cartTotal = useMemo(() => {
    const coursesSubtotal = courses.reduce(
      (acc, course) => acc + course.price * course.quantity,
      0
    );
    const reservationsTotal = reservations.reduce(
      (acc, reservation) => acc + reservation.price,
      0
    );
    return coursesSubtotal + reservationsTotal;
  }, [courses, reservations]);

  if (!isVisible) return null;

  const getConfirmText = (action) => {
    const texts = {
      "Cancelar Reserva de Turno":
        "¿Estás seguro/a que querés Cancelar la Reserva de tu Turno?",
      "Eliminar Curso del Carrito":
        "¿Estás seguro/a que querés Eliminar este Curso de tu Carrito?",
      "Vaciar Carrito": "¿Estás seguro/a que querés Vaciar todo tu Carrito?",
      Sumar:
        "¿Estás seguro/a que querés Agregar una Unidad más de este Curso a tu Pedido?",
      Restar:
        "¿Estás seguro/a que querés Quitar una Unidad de este Curso de tu Pedido?",
    };
    return texts[action] || "";
  };

  const handleActionConfirmation = (
    action,
    itemId,
    itemType,
    currentQuantity
  ) => {
    setActionType(action);
    setModalContent({
      title: action,
      text: getConfirmText(action),
      itemId,
      itemType,
      currentQuantity,
    });
    setShowModal(true);
  };

  const handleAction = () => {
    const { itemId, itemType, currentQuantity } = modalContent;
    switch (actionType) {
      case "Cancelar Reserva de Turno":
        cancelReservation(itemId);
        break;
      case "Eliminar Curso del Carrito":
        removeItem(itemId, itemType);
        break;
      case "Vaciar Carrito":
        clear();
        setIsCartEmpty(true);
        break;
      case "Sumar":
      case "Restar": {
        const course = courses.find((course) => course.id === itemId);
        if (course) {
          const stockLeft = course.stock + course.quantity;
          if (
            (actionType === "Sumar" && stockLeft > 0) ||
            (actionType === "Restar" && currentQuantity > 1)
          ) {
            const newQuantity =
              currentQuantity + (actionType === "Sumar" ? 1 : -1);
            updateCartItem(itemId, newQuantity, itemType);
          }
        }
        break;
      }
      default:
        break;
    }
    setShowModal(false);
  };

  const isIncrementDisabled = (course) =>
    course.quantity >= course.stock + course.quantity;

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <button className="close-button" onClick={() => setIsVisible(false)}>
          &times;
        </button>
        <h1>Carrito</h1>
        {isCartEmpty || (courses.length === 0 && reservations.length === 0) ? (
          <p>Tu Carrito está Vacío...</p>
        ) : (
          <>
            {courses.length > 0 && (
              <>
                <h2>Cursos On Demand</h2>
                <ul className="list-unstyled">
                  {courses.map((course) => {
                    const subtotal = course.price * course.quantity;
                    return (
                      <li
                        key={`${course.id}-${course.selectedDate}-${course.selectedTime}`}
                      >
                        <div className="cart-item">
                          <div className="cart-item-details">
                            <h3>{course.title}</h3>
                            <h4>Precio por Unidad: ${course.price}</h4>
                            <div className="item-count-cart">
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  handleActionConfirmation(
                                    "Restar",
                                    course.id,
                                    "cursos",
                                    course.quantity
                                  )
                                }
                                disabled={course.quantity <= 1}
                              >
                                -
                              </Button>
                              <span>{course.quantity}</span>
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  handleActionConfirmation(
                                    "Sumar",
                                    course.id,
                                    "cursos",
                                    course.quantity
                                  )
                                }
                                disabled={isIncrementDisabled(course)}
                              >
                                +
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() =>
                                  handleActionConfirmation(
                                    "Eliminar Curso del Carrito",
                                    course.id,
                                    "cursos"
                                  )
                                }
                              >
                                Eliminar
                              </Button>
                            </div>
                            <h4>Subtotal: ${subtotal}</h4>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {reservations.length > 0 && (
              <>
                <h2>Reservas de Turnos para Consultoría Astrológica</h2>
                <ul className="list-unstyled">
                  {reservations.map((reservation) => (
                    <li key={reservation.id}>
                      <div className="cart-item">
                        <div className="cart-item-details">
                          <h3>{reservation.title}</h3>
                          <h4>Precio: ${reservation.price}</h4>
                          <p>Fecha: {reservation.date}</p>
                          <p>Hora: {reservation.time}</p>
                          <Button
                            variant="warning"
                            onClick={() =>
                              handleActionConfirmation(
                                "Cancelar Reserva de Turno",
                                reservation.id
                              )
                            }
                          >
                            Cancelar Reserva
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="cart-total">
              <h3>Total a Pagar ${cartTotal}</h3>
              <Button
                variant="danger"
                onClick={() => handleActionConfirmation("Vaciar Carrito")}
              >
                Vaciar mi Carrito
              </Button>
              <Link
                to="/checkout"
                className="btn btn-primary"
                onClick={() => setIsVisible(false)}
              >
                Finalizar mi Compra
              </Link>
            </div>
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAction}>
            Confirmar
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
