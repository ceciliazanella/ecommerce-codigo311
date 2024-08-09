import { useState, useContext, useMemo } from "react";
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
      case "Cancelar Reserva de Turno":
        return "¿Estás seguro/a que querés Cancelar la Reserva de tu Turno?";
      case "Eliminar Servicio del Carrito":
        return "¿Estás seguro/a que querés Eliminar este Servicio de tu Carrito?";
      case "Vaciar Carrito":
        return "¿Estás seguro/a que querés Vaciar todo tu Carrito?";
      case "Sumar":
        return "¿Estás seguro/a de querer Sumar una Unidad de este Curso?";
      case "Restar":
        return "¿Estás seguro/a de querer Quitar una Unidad de este Curso?";
      default:
        return "";
    }
  };

  const handleAction = async (action, itemId, itemType, currentQuantity) => {
    const confirmText = getConfirmText(action);
    console.log(`Acción Solicitada: ${action}`);
    console.log(
      `ID del Servicio: ${itemId}, Tipo: ${itemType}, Cantidad Actual: ${currentQuantity}`
    );

    if (!confirmText) return;

    const result = await Swal.fire({
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      ...swalCustomStyles,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) {
      console.log("Acción Cancelada por el Usuario.");
      return;
    }

    switch (action) {
      case "Cancelar Reserva de Turno":
        console.log("Cancelando Reserva de Turno...");
        cancelReservation(itemId);
        break;
      case "Eliminar Servicio del Carrito":
        console.log("Eliminando Servicio del Carrito...");
        removeItem(itemId, itemType);
        break;
      case "Vaciar Carrito":
        console.log("Vaciando todo el Carrito...");
        clear();
        setIsVisible(false);
        break;
      case "Sumar":
      case "Restar":
        console.log(`Actualizando Cantidad del Curso ${itemId}...`);
        const course = courses.find((course) => course.id === itemId);
        if (course) {
          const stockLeft = course.stock + course.quantity;
          if (
            (action === "Sumar" && stockLeft > 0) ||
            (action === "Restar" && currentQuantity > 1)
          ) {
            const newQuantity = currentQuantity + (action === "Sumar" ? 1 : -1);
            console.log(`Cantidad Actualizada: ${newQuantity}`);
            updateCartItem(itemId, newQuantity, itemType);
          } else {
            console.log(
              "No se puede actualizar la Cantidad (El Stock es insuficiente o se alcanzó la Cantidad mínima)."
            );
          }
        }
        break;
      default:
        console.log("Acción no reconocida...");
        break;
    }
  };

  const isIncrementDisabled = (course) =>
    course.quantity >= course.stock + course.quantity;

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <button
          className="close-button"
          onClick={() => {
            console.log("Cerrando el Carrito...");
            setIsVisible(false);
          }}
        >
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
                              onClick={() => {
                                console.log(
                                  `Intentando Restar la Cantidad del Curso ${course.id}`
                                );
                                handleAction(
                                  "Restar",
                                  course.id,
                                  "cursos",
                                  course.quantity
                                );
                              }}
                              disabled={course.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{course.quantity}</span>
                            <button
                              className="btn"
                              onClick={() => {
                                console.log(
                                  `Intentando Sumar la Cantidad del Curso ${course.id}`
                                );
                                handleAction(
                                  "Sumar",
                                  course.id,
                                  "cursos",
                                  course.quantity
                                );
                              }}
                              disabled={isIncrementDisabled(course)}
                            >
                              +
                            </button>
                            <button
                              className="btn"
                              onClick={() => {
                                console.log(
                                  `Intentando Eliminar el Curso ${course.id} del Carrito.`
                                );
                                handleAction(
                                  "Eliminar Servicio del Carrito",
                                  course.id,
                                  "cursos"
                                );
                              }}
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
                            onClick={() => {
                              console.log(
                                `Intentando Cancelar la Reserva ${reservation.id}.`
                              );
                              handleAction(
                                "Cancelar Reserva de Turno",
                                reservation.id
                              );
                            }}
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
                onClick={() => {
                  console.log("Vaciando el Carrito...");
                  handleAction("Vaciar Carrito");
                }}
              >
                Vaciar mi Carrito
              </button>
              <button
                className="btn"
                onClick={() => {
                  console.log("Procediendo a Comprar el Carrito...");
                  handleAction("Comprar todo tu Carrito");
                }}
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
