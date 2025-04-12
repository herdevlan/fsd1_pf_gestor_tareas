import React from 'react';
import { Card, Button } from 'react-bootstrap';

const TarjetaTarea = ({ tarea, editarTarea, eliminarTarea }) => {
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{tarea.titulo}</Card.Title>
        <Card.Text>{tarea.descripcion}</Card.Text>
        <Card.Text><strong>Estado:</strong> {tarea.estado}</Card.Text>
        <Card.Text><strong>Fecha:</strong> {formatearFecha(tarea.fecha)}</Card.Text>
        <div className="d-flex justify-content-end">
          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => editarTarea(tarea)}>
            Editar
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => eliminarTarea(tarea.id)}>
            Eliminar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaTarea;
