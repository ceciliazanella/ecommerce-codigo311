import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ItemCount } from "./ItemCount";
import { ItemCalendar } from "./ItemCalendar";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetail.css";

export const ItemDetail = ({ item, onClose }) => {
  const { courses } = useCart();
  const [stock, setStock] = useState(item?.stock || 0);
  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      const cartItem = courses.find((course) => course.id === item.id);
      setStock(cartItem ? item.stock - cartItem.quantity : item.stock);
    }
  }, [item, courses]);

  const handleAddToCart = (quantity) => {
    console.log(`Agregar ${quantity} Unidad/es de ${item.title} al Carrito.`);
  };

  const renderItemDetails = useMemo(() => {
    if (!item) return null;

    return (
      <div className="item-info">
        <p className="item-description">{item.description}</p>
        <h3 className="item-price">Precio: ${item.price}</h3>

        {item.category === "cursos" && (
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
        )}

        {item.category === "consultoria" && (
          <ItemCalendar item={item} onClose={onClose} />
        )}
      </div>
    );
  }, [item, stock, onClose]);

  const handleGoBack = () => navigate(-1);

  if (!item) return <p>Detalles no encontrados...</p>;

  return (
    <>
      <h2 className="item-title">{item.title}</h2>
      <div className="item-detail">
        <div className="item-image-container">
          <img src={item.image} alt={item.title} className="item-image" />
        </div>
        {renderItemDetails}
      </div>
      <button onClick={handleGoBack} className="btn-volver">
        Volver
      </button>
    </>
  );
};
