import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TarjetaTarea from './TarjetaTarea';

const RejillaTareas = ({ tareasFiltradas, editarTarea, eliminarTarea }) => {
  return (
    <Row>
      {tareasFiltradas.map((tarea) => (
        <Col md={6} lg={4} key={tarea.id}>
          <TarjetaTarea
            tarea={tarea}
            editarTarea={editarTarea}
            eliminarTarea={eliminarTarea}
          />
        </Col>
      ))}
    </Row>
  );
};

export default RejillaTareas;
