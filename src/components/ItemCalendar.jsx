import React, { useState, useEffect } from "react";
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
      const formattedDate = format(selectedDate, "dd MMMM yyyy", {
        locale: es,
      });

      Swal.fire({
        title: "Confirmar Reserva",
        text: `¿Estás seguro/a que quieres reservar el turno para el ${formattedDate} a las ${selectedTime} para ${item.title}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, Reservar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          addToCart(item, 1, formattedDate, selectedTime);
          Swal.fire(
            "Reserva Confirmada",
            `Tu reserva para ${item.title} está confirmada para el ${formattedDate} a las ${selectedTime}.`,
            "success"
          );
          setIsReserved(true);
          onReservationConfirmed(formattedDate, selectedTime);
          setSelectedDate(null);
          setSelectedTime("");
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, selecciona una fecha y una hora válidas.",
        icon: "error",
      });
    }
  };

  const handleCancelReservation = () => {
    Swal.fire({
      title: "Confirmar Cancelación",
      text: `¿Estás seguro/a que quieres cancelar tu reserva para ${item.title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Cancelar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelReservation(item.id);
        Swal.fire(
          "Reserva Cancelada",
          "Has cancelado tu reserva. Puedes realizar una nueva reserva cuando quieras.",
          "success"
        );
        setIsReserved(false);
        setSelectedDate(null);
        setSelectedTime("");
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
