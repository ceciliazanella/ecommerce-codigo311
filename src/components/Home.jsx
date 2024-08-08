import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";

export const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      setData([
        { id: 1, title: "Consultoría Astrológica", path: "/consultoria" },
        { id: 2, title: "Cursos On Demand", path: "/cursos" },
      ]);
    };

    const timer = setTimeout(fetchData, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="home-main">
      <h1 className="home-intro">
        Bienvenidos al espacio que investiga la conexión entre el Cielo y la
        Tierra a través de las Estrellas!
      </h1>
      <div className="home-cards">
        {data.length === 0 ? (
          <p>Cargando...</p>
        ) : (
          data.map(({ id, title, path }) => (
            <Card key={id} className="home-card">
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Link to={path}>
                  <Button variant="primary">Explorar</Button>
                </Link>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </main>
  );
};
