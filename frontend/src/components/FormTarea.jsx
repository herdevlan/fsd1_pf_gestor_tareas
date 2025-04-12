import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const FormTarea = ({
  showModal,
  handleCloseModal,
  tareaEnEdicion,
  manejarCambioFormulario,
  guardarTarea,
}) => {
  const esEdicion = !!tareaEnEdicion?.id;

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? 'Editar Tarea' : 'Crear Tarea'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={guardarTarea}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              value={tareaEnEdicion?.titulo || ''}
              onChange={manejarCambioFormulario}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={tareaEnEdicion?.descripcion || ''}
              onChange={manejarCambioFormulario}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={tareaEnEdicion?.estado || 'pendiente'}
              onChange={manejarCambioFormulario}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={tareaEnEdicion?.fecha?.substring(0, 10) || ''}
              onChange={manejarCambioFormulario}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {esEdicion ? 'Guardar Cambios' : 'Crear Tarea'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormTarea;
