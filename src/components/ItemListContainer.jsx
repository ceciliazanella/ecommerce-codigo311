import React, { useEffect, useState, useCallback } from "react";
import { ItemList } from "./ItemList";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemListContainer.css";

const itemsFromMock = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch("/data/mockData.json");

  if (!response.ok) {
    throw new Error("Error al obtener los datos.");
  }

  return response.json();
};

export const ItemListContainer = ({ category }) => {
  const { courses } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsMock = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { items: allItems } = await itemsFromMock();
      const filteredItems = allItems
        .filter((item) => item.category === category)
        .map((item) => {
          const storedItem = courses.find((course) => course.id === item.id);
          return storedItem
            ? { ...item, stock: item.stock - storedItem.quantity }
            : item;
        });

      setItems(filteredItems);
    } catch (err) {
      setError("Error al extraer los datos.");
      console.error("Error al extraer los datos:", err);
    } finally {
      setLoading(false);
    }
  }, [category, courses]);

  useEffect(() => {
    itemsMock();
  }, [itemsMock]);

  return (
    <div className="item-list-container">
      <h1 className="h1-title">{category}</h1>
      <div className="item-list-content">
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <ItemList items={items} />}
      </div>
    </div>
  );
};
