import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const FiltrosTarea = ({
  filtroEstado,
  setFiltroEstado,
  filtroFecha,
  setFiltroFecha,
  filtroBusqueda,
  setFiltroBusqueda,
}) => {
  return (
    <Form className="mb-4">
      <Row>
        <Col md={4}>
          <Form.Select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Buscar por palabra clave"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default FiltrosTarea;
