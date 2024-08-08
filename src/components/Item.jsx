import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Item.css";

export const Item = ({ item }) => {
  const { category, image, title, id } = item;

  return (
    <div className="item-card">
      <h2 className="item-category">{category}</h2>
      <div className="item-image">
        <img src={image} alt={title} className="item-image" />
      </div>
      <div className="card-body">
        <h3 className="item-title">{title}</h3>
        <Link to={`/item/${id}`} className="btn">
          Ver Detalle
        </Link>
      </div>
    </div>
  );
};
