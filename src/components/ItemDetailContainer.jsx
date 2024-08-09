import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ItemDetail } from "./ItemDetail";
import data from "../data/data.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetailContainer.css";

export const ItemDetailContainer = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(data.items);
        } catch (err) {
          reject(err);
        }
      }, 2000);
    })
      .then((items) => {
        const foundItem = items.find((item) => item.id === Number(id));
        if (foundItem) {
          setItem(foundItem);
        } else {
          setError("No se encontró el Detalle buscado.");
        }
      })
      .catch((err) => {
        setError("Error al buscar Detalles.");
        console.error("Error al buscar Detalles:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="item-detail-container">
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {item && !loading && !error && <ItemDetail item={item} />}
    </div>
  );
};
