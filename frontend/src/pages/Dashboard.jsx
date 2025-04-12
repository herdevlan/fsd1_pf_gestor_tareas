import { useEffect, useState } from "react";
import API from "../services/axios";
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Form, Tooltip, OverlayTrigger } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Dashboard() {
  const { logout } = useAuth();

  const [usuario, setUsuario] = useState({ nombre: "", email: "" });
  const [tareas, setTareas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModalTarea, setMostrarModalTarea] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tareaActual, setTareaActual] = useState({
    titulo: "",
    fechaLimite: "",
    descripcion: "",
    estado: "",
  });
  const [idActual, setIdActual] = useState(null);

  useEffect(() => {
    cargarUsuario();
    cargarTareas();
  }, []);

  const cargarUsuario = async () => {
    try {
      const res = await API.get("/auth/me");
      setUsuario(res.data);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  };

  const cargarTareas = async () => {
    try {
      const res = await API.get("/tasks");
      setTareas(res.data);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    }
  };

  const handleGuardarTarea = async () => {
    if (!tareaActual.titulo.trim()) {
      alert("El título es obligatorio.");
      return;
    }

    const datosTarea = {
      titulo: tareaActual.titulo.trim(),
      estado: tareaActual.estado || "pendiente",
      fechaLimite: tareaActual.fechaLimite || null,
      descripcion: tareaActual.descripcion?.trim() || "",
    };

    try {
      if (modoEdicion) {
        await API.put(`/tasks/${idActual}`, datosTarea);
      } else {
        await API.post("/tasks", datosTarea);
      }
      cerrarModalTarea();
      cargarTareas();
    } catch (error) {
      console.error("Error al guardar la tarea:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Ocurrió un error al guardar la tarea.");
    }
  };

  const eliminarTarea = async (id) => {
    if (window.confirm("¿Eliminar esta tarea?")) {
      try {
        await API.delete(`/tasks/${id}`);
        cargarTareas();
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  };

  const avanzarEstado = async (tarea) => {
    const siguienteEstado = {
      pendiente: "en progreso",
      "en progreso": "completada",
      completada: "completada",
    };

    const nuevoEstado = siguienteEstado[tarea.estado];
    if (tarea.estado === nuevoEstado) return;

    try {
      await API.put(`/tasks/${tarea.id}`, { ...tarea, estado: nuevoEstado });
      cargarTareas();
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
      alert("No se pudo cambiar el estado.");
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setTareaActual({ titulo: "", fechaLimite: "", descripcion: "", estado: "pendiente" });
    setMostrarModalTarea(true);
  };

  const abrirModalEditar = (t) => {
    setIdActual(t.id);
    setTareaActual({
      titulo: t.titulo,
      fechaLimite: t.fechaLimite || "",
      descripcion: t.descripcion || "",
      estado: t.estado,
    });
    setModoEdicion(true);
    setMostrarModalTarea(true);
  };

  const cerrarModalTarea = () => {
    setMostrarModalTarea(false);
    setTareaActual({ titulo: "", fechaLimite: "", descripcion: "", estado: "" });
  };

  const capitalizarEstado = (estado) => {
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  const tareasFiltradas = tareas.filter((t) => {
    const fechaLimite = t.fechaLimite ? new Date(t.fechaLimite) : null;
    const inicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
    const fin = filtroFechaFin ? new Date(filtroFechaFin) : null;

    const fechaLimiteStr = fechaLimite ? fechaLimite.toISOString().split('T')[0] : null;
    const inicioStr = inicio ? inicio.toISOString().split('T')[0] : null;
    const finStr = fin ? fin.toISOString().split('T')[0] : null;

    return (
      (!filtroEstado || t.estado === filtroEstado) &&
      (!inicioStr || (fechaLimiteStr && fechaLimiteStr >= inicioStr)) &&
      (!finStr || (fechaLimiteStr && fechaLimiteStr <= finStr)) &&
      (t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.descripcion?.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  const ordenarTareas = (tareas) => {
    const pendiente = tareas.filter((t) => t.estado === "pendiente").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const enProgreso = tareas.filter((t) => t.estado === "en progreso").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const completada = tareas.filter((t) => t.estado === "completada").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return [...pendiente, ...enProgreso, ...completada];
  };

  const tareasOrdenadas = ordenarTareas(tareasFiltradas);

  const ajustarFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getUTCFullYear();
    const month = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = fechaObj.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getColorFondoTarjeta = (estado) => {
    if (estado === "pendiente") return "#f8d7da";
    if (estado === "en progreso") return "#fff3cd";
    if (estado === "completada") return "#d4edda";
  };

  const getColorIndicadorEstado = (estado) => {
    if (estado === "pendiente") return "#f44336";
    if (estado === "en progreso") return "#FFC107";
    if (estado === "completada") return "#4caf50";
  };

  return (
    <div className="container py-4">
      <div className="sticky-top bg-white shadow pb-4" style={{ zIndex: 1000 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Hola, {usuario.nombre}</h2>
              <p className="text-muted">{usuario.email}</p>
            </div>
            <button className="btn btn-outline-danger" onClick={logout}>Cerrar sesión</button>
          </div>

          <div className="d-flex flex-wrap gap-3 mb-1 align-items-end">
            <button className="btn btn-success" onClick={abrirModalCrear}>+ Nueva Tarea</button>

            <div style={{ maxWidth: 200 }}>
              <label className="form-label">Buscar</label>
              <input className="form-control" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>

            <div style={{ maxWidth: 150 }}>
              <label className="form-label">Estado</label>
              <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div style={{ maxWidth: 200 }}>
              <label className="form-label">Fecha desde</label>
              <input type="date" className="form-control" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
            </div>

            <div style={{ maxWidth: 200 }}>
              <label className="form-label">Fecha hasta</label>
              <input type="date" className="form-control" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="row">
          {tareasOrdenadas.map((t) => (
            <div className="col-md-4 mb-4" key={t.id}>
              <div className="card shadow h-100" style={{ backgroundColor: getColorFondoTarjeta(t.estado) }}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5>{t.titulo}</h5>
                    <span className={`badge ${t.estado === "completada" ? "bg-success" : t.estado === "en progreso" ? "bg-warning text-dark" : "bg-danger"}`}>
                      {capitalizarEstado(t.estado)}
                    </span>
                    <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>{new Date(t.createdAt).toLocaleString()}</p>
                    <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
                      {t.fechaLimite ? `Fecha límite: ${ajustarFecha(t.fechaLimite)}` : "Sin fecha límite"}
                    </p>
                    {t.descripcion && (
                      <p className="mt-2 fst-italic" style={{ fontSize: "0.9rem", color: "#555" }}>
                        {t.descripcion.length > 100 ? t.descripcion.slice(0, 100) + "..." : t.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="estado-barra flex-grow-1 me-2" onClick={() => avanzarEstado(t)} style={{ position: "relative", height: "20px", background: "#e9ecef", borderRadius: "15px", cursor: "pointer" }}>
                      <div
                        className="estado-indicador"
                        style={{
                          backgroundColor: getColorIndicadorEstado(t.estado),
                          position: "absolute",
                          top: "0",
                          left: t.estado === "pendiente" ? "0%" : t.estado === "en progreso" ? "33.33%" : "66.66%",
                          width: "33.33%",
                          height: "100%",
                          borderRadius: "15px",
                          transition: "left 0.3s ease, background-color 0.3s ease",
                        }}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      {t.estado !== "completada" && (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Editar tarea</Tooltip>}>
                          <i className="bi bi-pencil-square text-primary" onClick={() => abrirModalEditar(t)} style={{ cursor: "pointer", fontSize: "1.3rem" }}></i>
                        </OverlayTrigger>
                      )}
                      {t.estado === "completada" && (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar tarea</Tooltip>}>
                          <i className="bi bi-trash3 text-danger" onClick={() => eliminarTarea(t.id)} style={{ cursor: "pointer", fontSize: "1.3rem" }}></i>
                        </OverlayTrigger>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={mostrarModalTarea} onHide={cerrarModalTarea} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? "Editar Tarea" : "Nueva Tarea"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título <span className="text-danger">*</span></Form.Label>
              <Form.Control value={tareaActual.titulo} onChange={(e) => setTareaActual({ ...tareaActual, titulo: e.target.value })} placeholder="Escribe el título de la tarea" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha límite</Form.Label>
              <Form.Control type="date" value={tareaActual.fechaLimite} onChange={(e) => setTareaActual({ ...tareaActual, fechaLimite: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={tareaActual.descripcion} onChange={(e) => setTareaActual({ ...tareaActual, descripcion: e.target.value })} placeholder="Descripción de la tarea" />
            </Form.Group>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              <span className="text-danger">*</span> Campos obligatorios
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalTarea}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarTarea}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
