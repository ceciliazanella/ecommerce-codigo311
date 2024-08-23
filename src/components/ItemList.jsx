import { Item } from "./Item";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ItemList.css";

export const ItemList = ({ items }) => {
  return (
    <div className="item-list">
      {items.length === 0 ? (
        <p>No hay Elementos Disponibles...</p>
      ) : (
        items.map((item) => <Item key={item.id} item={item} />)
      )}
    </div>
  );
};
