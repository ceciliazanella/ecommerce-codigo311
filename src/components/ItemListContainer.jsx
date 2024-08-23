import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { ItemList } from "./ItemList";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemListContainer.css";

export const ItemListContainer = ({ addToCart }) => {
  const { id: categoryId } = useParams();
  const { courses } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTitle = (categoryId) => {
    const titles = {
      consultoria: "Consultoría Astrológica",
      cursos: "Cursos On Demand",
    };
    return titles[categoryId] || "Categoría no Encontrada";
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const itemsRef = collection(db, "ItemCollectionI");
    const q = query(itemsRef, where("categoryId", "==", categoryId));

    getDocs(q)
      .then((querySnapshot) => {
        const allItems = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const filteredItems = allItems.filter((item) => {
          const storedItem = courses.find((course) => course.id === item.id);
          if (storedItem) {
            item.stock = item.stock - storedItem.quantity;
            return true;
          }
          return true;
        });

        setItems(filteredItems);
      })
      .catch((err) => {
        setError("Error al querer Extraer los Datos de los Servicios...");
        console.error("Error al Extraer los Datos de los Servicios:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId, courses]);

  return (
    <div className="item-list-container">
      <h1 className="h1-title">{getTitle(categoryId)}</h1>
      <div className="item-list-content">
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <ItemList items={items} addToCart={addToCart} />}
      </div>
    </div>
  );
};
