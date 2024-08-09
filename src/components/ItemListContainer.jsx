import { useState, useEffect } from "react";
import { ItemList } from "./ItemList";
import { useCart } from "../context/CartContext";
import data from "../data/data.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemListContainer.css";

export const ItemListContainer = ({ category }) => {
  const { courses } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      setError(null);

      new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(data.items);
          } catch (err) {
            reject(err);
          }
        }, 2000);
      })
        .then((allItems) => {
          const filteredItems = allItems
            .filter((item) => item.category === category)
            .map((item) => {
              const storedItem = courses.find(
                (course) => course.id === item.id
              );
              return storedItem
                ? { ...item, stock: item.stock - storedItem.quantity }
                : item;
            });

          setItems(filteredItems);
        })
        .catch((err) => {
          setError("Error al extraer los Datos.");
          console.error("Error al extraer los Datos:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getData();
  }, [category, courses]);

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
