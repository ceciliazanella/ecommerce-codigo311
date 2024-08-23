import React, { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartVisible, setCartVisible] = useState(false);

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const storedReservations =
      JSON.parse(localStorage.getItem("reservations")) || [];
    setCourses(storedCourses);
    setReservations(storedReservations);
    updateCartQuantity();
  }, []);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("reservations", JSON.stringify(reservations));
    updateCartQuantity();
  }, [courses, reservations]);

  const updateCartQuantity = () => {
    const totalQuantity =
      courses.reduce((sum, course) => sum + course.quantity, 0) +
      reservations.reduce((sum, reservation) => sum + reservation.quantity, 0);
    setCartQuantity(totalQuantity);
  };

  const isTimeReserved = (date, time) =>
    reservations.some(
      (reservation) => reservation.date === date && reservation.time === time
    );

  const isProductInCart = (id, categoryId) => {
    if (categoryId === "cursos") {
      return courses.some((course) => course.id === id);
    }
    if (categoryId === "consultoria") {
      return reservations.some((reservation) => reservation.id === id);
    }
    return false;
  };

  const addToCart = (item, quantity, selectedDate, selectedTime) => {
    if (item.categoryId === "cursos") {
      setCourses((prevCourses) => {
        const existingCourse = prevCourses.find(
          (course) => course.id === item.id
        );
        if (existingCourse) {
          const newQuantity = existingCourse.quantity + quantity;
          if (item.stock >= newQuantity) {
            return prevCourses.map((course) =>
              course.id === item.id
                ? {
                    ...course,
                    quantity: newQuantity,
                    stock: item.stock - newQuantity,
                  }
                : course
            );
          }
        } else if (item.stock >= quantity) {
          return [
            ...prevCourses,
            { ...item, quantity, stock: item.stock - quantity },
          ];
        }
        return prevCourses;
      });
    } else if (item.categoryId === "consultoria") {
      setReservations((prevReservations) => {
        const exists = prevReservations.some(
          (reservation) =>
            reservation.id === item.id &&
            reservation.date === selectedDate &&
            reservation.time === selectedTime
        );
        if (!exists) {
          return [
            ...prevReservations,
            { ...item, date: selectedDate, time: selectedTime, quantity },
          ];
        }
        return prevReservations;
      });
    }
  };

  const cancelReservation = (itemId) => {
    setReservations((prevReservations) =>
      prevReservations.filter((reservation) => reservation.id !== itemId)
    );
  };

  const removeItem = (itemId, itemType) => {
    if (itemType === "cursos") {
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== itemId)
      );
    } else if (itemType === "consultoria") {
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== itemId)
      );
    }
  };

  const updateCartItem = (itemId, newQuantity, itemType) => {
    if (itemType === "cursos") {
      setCourses((prevCourses) =>
        prevCourses.map((course) => {
          if (course.id === itemId) {
            const stockLeft = course.stock + course.quantity - newQuantity;
            if (stockLeft >= 0) {
              return { ...course, quantity: newQuantity, stock: stockLeft };
            }
          }
          return course;
        })
      );
    } else if (itemType === "consultoria") {
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === itemId
            ? { ...reservation, quantity: newQuantity }
            : reservation
        )
      );
    }
  };

  const clear = () => {
    setCourses([]);
    setReservations([]);
    setIsConfirmed(false);
    localStorage.removeItem("courses");
    localStorage.removeItem("reservations");
  };

  const toggleCartVisibility = () => {
    setCartVisible((prevVisible) => !prevVisible);
  };

  const contextValues = {
    courses,
    reservations,
    isConfirmed,
    setIsConfirmed,
    cartQuantity,
    cartVisible,
    addToCart,
    cancelReservation,
    clear,
    isInCart: (id) =>
      courses.some((course) => course.id === id) ||
      reservations.some((reservation) => reservation.id === id),
    isProductInCart,
    isTimeReserved,
    removeItem,
    updateCartItem,
    toggleCartVisibility,
  };

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartContextProvider");
  }
  return context;
};
