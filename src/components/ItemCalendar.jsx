import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemCalendar.css";

const isWeekend = (date) => [0, 6].includes(date.getDay());

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

  useEffect(() => {
    console.log("Verificando si el Servicio está reservado...");
    const reserved = isProductInCart(item.id, "consultoria");
    console.log(`Estado de Reserva de Turno del Servicio: ${reserved}`);
    setIsReserved(reserved);
    if (reserved) {
      console.log("El Servicio está reservado, cerrando el Calendario...");
      onClose();
    }
  }, [item.id, isProductInCart, onClose]);

  const handleDateChange = (date) => {
    console.log("Fecha Seleccionada:", date);
    setSelectedDate(date);
    setSelectedTime("");
    setIsConfirmed(false);
  };

  const handleTimeChange = (e) => {
    console.log("Hora Seleccionada:", e.target.value);
    setSelectedTime(e.target.value);
    setIsConfirmed(false);
  };

  const handleReserve = () => {
    console.log(
      "Intentando realizar Reserva de Turno con Fecha:",
      selectedDate,
      "y Hora:",
      selectedTime
    );
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, "dd MMMM yyyy", {
        locale: es,
      });
      console.log("Fecha Establecida:", formattedDate);

      Swal.fire({
        title: "Confirmar Reserva",
        text: `¿Estás seguro/a que querés Reservar Turno para ${item.title} el día ${formattedDate} a las ${selectedTime} hs?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Reservar.",
        cancelButtonText: "Cancelar!",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Reserva Confirmada.");
          addToCart(item, 1, formattedDate, selectedTime);
          Swal.fire(
            "¡Reserva Confirmada!",
            `Tu Reserva de Turno para ${item.title} está confirmada para el día ${formattedDate} a las ${selectedTime} hs.`,
            "success"
          );
          setIsReserved(true);
          onReservationConfirmed(formattedDate, selectedTime);
          setSelectedDate(null);
          setSelectedTime("");
        } else {
          console.log("Reserva Cancelada por el Usuario.");
        }
      });
    } else {
      console.log("Fecha u Hora no seleccionada.");
      Swal.fire({
        title: "¡Error!",
        text: "Por favor, seleccioná una Fecha y una Hora válida.",
        icon: "error",
      });
    }
  };

  const handleCancelReservation = () => {
    console.log("Intentando Cancelar la Reserva para el Servicio:", item.title);
    Swal.fire({
      title: "Confirmar Cancelación.",
      text: `¿Estás seguro/a que querés Cancelar tu Reserva para ${item.title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Cancelar.",
      cancelButtonText: "Cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Reserva Cancelada.");
        cancelReservation(item.id);
        Swal.fire(
          "¡Reserva Cancelada!",
          "Cancelaste la Reserva de tu Turno. Podés realizar una nueva Reserva cuando quieras!",
          "success"
        );
        setIsReserved(false);
        setSelectedDate(null);
        setSelectedTime("");
      } else {
        console.log(
          "Cancelación de Reserva de Turno realizada por el Usuario."
        );
      }
    });
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
            {Array.from({ length: 5 }, (_, i) => 9 + i * 2).map((hour) => (
              <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
            ))}
          </select>
        </label>
        {isReserved && (
          <button className="btn btn-danger" onClick={handleCancelReservation}>
            Cancelar Reserva
          </button>
        )}
        <button
          className={`btn ${
            isReserved ? "btn-success" : "btn-primary"
          } reserve-button`}
          onClick={handleReserve}
          disabled={isReserved}
        >
          {isReserved ? "Reserva Confirmada" : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
};
