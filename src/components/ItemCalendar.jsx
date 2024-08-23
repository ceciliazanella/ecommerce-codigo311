import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Modal, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCalendar.css";

const isWeekend = (date) => [0, 6].includes(date.getDay());
const HOURS = Array.from({ length: 5 }, (_, i) => 9 + i * 2).map(
  (hour) => `${hour}:00`
);
const DATE_FORMAT = "dd MMMM yyyy";

export const ItemCalendar = ({
  item,
  onClose = () => {},
  onReservationConfirmed = () => {},
}) => {
  const { addToCart, isProductInCart, cancelReservation, setIsConfirmed } =
    useCart();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    const reserved = isProductInCart(item.id, "consultoria");
    setIsReserved(reserved);
    if (reserved) onClose();
  }, [item.id, isProductInCart, onClose]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setIsConfirmed(false);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setIsConfirmed(false);
  };

  const handleReserve = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, DATE_FORMAT, { locale: es });
      setModalContent({
        title: "Confirmar Reserva",
        text: `¿Estás seguro/a que querés Reservar Turno para ${item.title} el Día ${formattedDate} a las ${selectedTime} hs?`,
        confirmText: "Reservar",
        cancelText: "Cancelar",
        onConfirm: () => {
          addToCart(item, 1, formattedDate, selectedTime);
          setModalContent({
            title: "¡Reserva Confirmada!",
            text: `Tu Reserva para ${item.title} está Confirmada para el Día ${formattedDate} a las ${selectedTime} hs.`,
            confirmText: "Cerrar",
          });
          setIsReserved(true);
          onReservationConfirmed(formattedDate, selectedTime);
          setSelectedDate(null);
          setSelectedTime("");
        },
      });
      setShowModal(true);
    } else {
      setModalContent({
        title: "Mmm...",
        text: "Por favor, ¡Seleccioná una Fecha y una Hora válida!",
        confirmText: "Cerrar",
      });
      setShowModal(true);
    }
  };

  const handleCancelReservation = () => {
    setModalContent({
      title: "Confirmar Cancelación",
      text: `¿Estás seguro/a que querés Cancelar tu Reserva para ${item.title}?`,
      confirmText: "Confirmar Cancelación",
      cancelText: "Cancelar",
      onConfirm: () => {
        cancelReservation(item.id);
        setModalContent({
          title: "¡Reserva Cancelada!",
          text: "Cancelaste la Reserva de tu Turno... ¡Podés realizar una Nueva Reserva cuando quieras!",
          confirmText: "Cerrar",
        });
        setIsReserved(false);
        setSelectedDate(null);
        setSelectedTime("");
      },
    });
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div className="item-calendar">
      <div className="reservation-form">
        <h5 className="reservation-title">Reservar Turno</h5>
        <label className="reservation-label">
          Fecha
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            filterDate={(date) => date > new Date() && !isWeekend(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            disabled={isReserved}
          />
        </label>
        <label className="reservation-label">
          Hora
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="time-select"
            disabled={isReserved}
          >
            <option value="">Seleccionar Hora</option>
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </label>
        {isReserved && (
          <Button variant="danger" onClick={handleCancelReservation}>
            Cancelar Reserva
          </Button>
        )}
        <Button
          variant={isReserved ? "success" : "primary"}
          className="reserve-button"
          onClick={handleReserve}
          disabled={isReserved}
        >
          {isReserved ? "¡Reserva Confirmada!" : "Confirmar Reserva"}
        </Button>
      </div>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.text}</Modal.Body>
        <Modal.Footer>
          {modalContent.confirmText && (
            <Button
              variant="primary"
              onClick={() => {
                modalContent.onConfirm && modalContent.onConfirm();
                handleModalClose();
              }}
            >
              {modalContent.confirmText}
            </Button>
          )}
          {modalContent.cancelText && (
            <Button variant="secondary" onClick={handleModalClose}>
              {modalContent.cancelText}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
