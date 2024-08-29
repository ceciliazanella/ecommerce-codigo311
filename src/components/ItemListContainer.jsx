import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { ItemList } from "./ItemList";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemListContainer.css";

const Category_Titles = {
  consultoria: "Consultoría Astrológica",
  cursos: "Cursos On Demand",
};

export const ItemListContainer = ({ addToCart }) => {
  const { id: categoryId } = useParams();
  const { courses } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const itemsRef = collection(db, "ItemCollectionI");

    getDocs(itemsRef)
      .then((querySnapshot) => {
        const allItems = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const filteredItems = allItems.filter(
          (item) => item.categoryId === categoryId
        );

        const updatedItems = filteredItems.map((item) => {
          const storedItem = courses.find((course) => course.id === item.id);
          if (storedItem) {
            return { ...item, stock: item.stock - storedItem.quantity };
          }
          return item;
        });

        setItems(updatedItems);
      })
      .catch((err) => {
        setError("Mmmm... Error al querer Extraer los Datos de los Servicios.");
        console.error("Error al Extraer los Datos de los Servicios:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId, courses]);

  const title = Category_Titles[categoryId] || "Categoría no encontrada...";

  return (
    <div className="item-list-container">
      <h1 className="h1-title">{title}</h1>
      <div className="item-list-content">
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <ItemList items={items} addToCart={addToCart} />}
      </div>
    </div>
  );
};
