import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCalendar.css";

const Hours = Array.from({ length: 5 }, (_, i) => 9 + i * 2).map(
  (hour) => `${hour}:00`
);
const Date_Format = "dd MMMM yyyy";

export const ItemCalendar = ({
  item,
  onClose = () => {},
  onReservationConfirmed = () => {},
}) => {
  const { addToCart, isProductInCart, cancelReservation } = useCart();
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
  };

  const handleTimeChange = (e) => setSelectedTime(e.target.value);

  const handleModalClose = () => setShowModal(false);

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime("");
  };

  const showModalWithContent = (
    title,
    text,
    confirmText,
    cancelText,
    onConfirm
  ) => {
    setModalContent({ title, text, confirmText, cancelText, onConfirm });
    setShowModal(true);
  };

  const handleReserve = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, Date_Format, { locale: es });
      showModalWithContent(
        "Confirmar Reserva",
        `¿Estás seguro/a que querés Reservar Turno para ${item.title} el Día ${formattedDate} a las ${selectedTime} hs?`,
        "Reservar",
        "Cancelar",
        () => {
          addToCart(item, 1, formattedDate, selectedTime);
          setIsReserved(true);
          onReservationConfirmed(formattedDate, selectedTime);
          resetForm();
        }
      );
    } else {
      showModalWithContent(
        "Mmm...",
        "Por favor, ¡Seleccioná una Fecha y una Hora válida!",
        "Cerrar"
      );
    }
  };

  const handleCancelReservation = () => {
    showModalWithContent(
      "Confirmar Cancelación",
      `¿Estás seguro/a que querés Cancelar tu Reserva para ${item.title}?`,
      "Confirmar Cancelación",
      "Cancelar",
      () => {
        cancelReservation(item.id);
        setIsReserved(false);
        resetForm();
      }
    );
  };

  return (
    <div className="item-calendar">
      <div className="reservation-form">
        <h5 className="reservation-title">Reservar Turno</h5>
        <label className="reservation-label">
          Fecha
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            filterDate={(date) =>
              date > new Date() && ![0, 6].includes(date.getDay())
            }
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
            {Hours.map((hour) => (
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
                if (modalContent.onConfirm) modalContent.onConfirm();
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
