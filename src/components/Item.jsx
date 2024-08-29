import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Item.css";

export const Item = ({ item }) => {
  const { categoryId, imageId, title, id } = item;

  return (
    <div className="item-card">
      <h2 className="item-category">{categoryId}</h2>
      <div className="item-image">
        <img src={imageId} alt={title} className="img-fluid" />
      </div>
      <div className="card-body">
        <h3 className="item-title">{title}</h3>
        <Link to={`/item/${id}`} className="btn btn-primary">
          Ver Detalle
        </Link>
      </div>
    </div>
  );
};
