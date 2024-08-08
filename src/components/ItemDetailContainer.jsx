import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemDetail } from "./ItemDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetailContainer.css";

const delay = 2000;

const fetchItemFromApi = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
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
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const foundItem = await fetchItemFromApi(id);
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

    fetchItem();
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
