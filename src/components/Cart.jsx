import React, { useState, useContext, useMemo } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
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

  const swalCustomStyles = {
    confirmButtonColor: "#63768D",
    cancelButtonColor: "#36213E",
    background: "#D0CCD0",
    color: "#36213E",
  };

  const getConfirmText = (action) => {
    switch (action) {
      case "Cancelar la Reserva de tu Turno":
        return "¿Estás seguro/a que querés Cancelar la Reserva de tu Turno para realizar este Servicio?";
      case "Eliminar este Servicio de tu Carrito":
        return "¿Estás seguro/a que querés Eliminar este Servicio de tu Carrito?";
      case "Vaciar todo tu Carrito":
        return "¿Estás seguro/a que querés Vaciar todo tu Carrito?";
      case "incrementar":
        return "¿Estás seguro/a de querer Sumar otra Unidad más de este Curso?";
      case "decrementar":
        return "¿Estás seguro/a de querer Quitar una Unidad de este Curso?";
      default:
        return "";
    }
  };

  const handleAction = async (action, itemId, itemType, currentQuantity) => {
    const confirmText = getConfirmText(action);

    if (!confirmText) return;

    const result = await Swal.fire({
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      ...swalCustomStyles,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    switch (action) {
      case "Cancelar la Reserva de tu Turno":
        cancelReservation(itemId);
        break;
      case "Eliminar este Servicio de tu Carrito":
        removeItem(itemId, itemType);
        break;
      case "Vaciar todo tu Carrito":
        clear();
        setIsVisible(false);
        break;
      case "incrementar":
      case "decrementar":
        const course = courses.find((course) => course.id === itemId);
        if (course) {
          const stockLeft = course.stock + course.quantity;
          if (
            (action === "incrementar" && stockLeft > 0) ||
            (action === "decrementar" && currentQuantity > 1)
          ) {
            updateCartItem(
              itemId,
              currentQuantity + (action === "incrementar" ? 1 : -1),
              itemType
            );
          }
        }
        break;
      default:
        break;
    }
  };

  const isIncrementDisabled = (course) =>
    course.quantity >= course.stock + course.quantity;

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <button className="close-button" onClick={() => setIsVisible(false)}>
          &times;
        </button>
        <h2>Carrito</h2>
        {courses.length === 0 && reservations.length === 0 ? (
          <p>Tu Carrito está Vacío...</p>
        ) : (
          <>
            {courses.length > 0 && (
              <>
                <h3>Cursos On Demand</h3>
                <ul className="list-unstyled">
                  {courses.map((course) => (
                    <li
                      key={`${course.id}-${course.selectedDate}-${course.selectedTime}`}
                    >
                      <div className="cart-item">
                        <div className="cart-item-details">
                          <h4>{course.title}</h4>
                          <h5>Precio por Unidad: ${course.price}</h5>
                          <div className="item-count-cart">
                            <button
                              className="btn"
                              onClick={() =>
                                handleAction(
                                  "decrementar",
                                  course.id,
                                  "cursos",
                                  course.quantity
                                )
                              }
                              disabled={course.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{course.quantity}</span>
                            <button
                              className="btn"
                              onClick={() =>
                                handleAction(
                                  "incrementar",
                                  course.id,
                                  "cursos",
                                  course.quantity
                                )
                              }
                              disabled={isIncrementDisabled(course)}
                            >
                              +
                            </button>
                            <button
                              className="btn"
                              onClick={() =>
                                handleAction(
                                  "Eliminar este Servicio de tu Carrito",
                                  course.id,
                                  "cursos"
                                )
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {reservations.length > 0 && (
              <>
                <h3>Reservas de Turnos para Consultoría Astrológica</h3>
                <ul className="list-unstyled">
                  {reservations.map((reservation) => (
                    <li key={reservation.id}>
                      <div className="cart-item">
                        <div className="cart-item-details">
                          <h4>{reservation.title}</h4>
                          <h5>Precio: ${reservation.price}</h5>
                          <p>Fecha: {reservation.date}</p>
                          <p>Hora: {reservation.time}</p>
                          <button
                            className="btn"
                            onClick={() =>
                              handleAction(
                                "Cancelar la Reserva de tu Turno",
                                reservation.id
                              )
                            }
                          >
                            Cancelar Reserva
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="cart-total">
              <h3>Total: ${cartTotal}</h3>
              <button
                className="btn"
                onClick={() => handleAction("Vaciar todo tu Carrito")}
              >
                Vaciar mi Carrito
              </button>
              <button
                className="btn"
                onClick={() => handleAction("Comprar todo tu Carrito")}
              >
                Comprar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
