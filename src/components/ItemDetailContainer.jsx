import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemDetail } from "./ItemDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetailContainer.css";

const itemFromMock = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch("/data/mockData.json");

  if (!response.ok) {
    throw new Error("Error al obtener los detalles.");
  }

  const { items } = await response.json();
  return items.find((item) => item.id === Number(id));
};

export const ItemDetailContainer = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const itemMock = async () => {
      setLoading(true);
      setError(null);

      try {
        const foundItem = await itemFromMock(id);
        if (foundItem) {
          setItem(foundItem);
        } else {
          setError("No se encontró el detalle buscado.");
        }
      } catch (err) {
        setError("Error al buscar detalles.");
        if (process.env.NODE_ENV === "development") {
          console.error("Error al buscar detalles:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    itemMock();
  }, [id]);

  return (
    <div className="item-detail-container">
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {item && !loading && !error && (
        <ItemDetail item={item} onClose={() => {}} />
      )}
    </div>
  );
};
