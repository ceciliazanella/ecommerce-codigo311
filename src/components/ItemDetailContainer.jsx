import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { ItemDetail } from "./ItemDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemDetailContainer.css";

export const ItemDetailContainer = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const itemRef = doc(db, "ItemCollectionI", id);

    getDoc(itemRef)
      .then((itemDetail) => {
        if (itemDetail.exists()) {
          setItem({ ...itemDetail.data(), id: itemDetail.id });
        } else {
          setError("Mmm... No se Encontró el Detalle del Servicio Buscado.");
        }
      })
      .catch(() => {
        setError("Error al Buscar los Detalles del Servicio.");
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
      {!item && !loading && !error && (
        <p>Los Detalles del Servicio seleccionado no están disponibles...</p>
      )}
    </div>
  );
};
