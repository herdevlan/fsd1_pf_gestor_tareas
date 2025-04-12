const { Tarea } = require('../../models');
const { Op } = require('sequelize');

// Crear tarea
exports.createTask = async (req, res) => {
  const { titulo, descripcion, fechaLimite } = req.body;

  const fechaLimiteFinal = fechaLimite || null;

  try {
    const tarea = await Tarea.create({
      titulo,
      descripcion,
      fechaLimite: fechaLimiteFinal,
      estado: 'pendiente',
      usuarioId: req.user.id
    });
    res.status(201).json({ message: 'Tarea creada exitosamente', task: tarea });
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
};

// Obtener todas las tareas del usuario, con filtros
exports.getAllTasks = async (req, res) => {
  const { status, search, fechaDesde, fechaHasta } = req.query;

  const where = {
    usuarioId: req.user.id,
    ...(status && { estado: status }),
    ...(search && {
      [Op.or]: [
        { titulo: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } }
      ]
    }),
    ...(fechaDesde && { fechaLimite: { [Op.gte]: new Date(fechaDesde) } }),
    ...(fechaHasta && {
      fechaLimite: {
        ...(where.fechaLimite || {}),
        [Op.lte]: new Date(fechaHasta)
      }
    })
  };

  try {
    const tareas = await Tarea.findAll({ where });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
};

// Obtener una sola tarea
exports.getOneTask = async (req, res) => {
  const tarea = await Tarea.findOne({
    where: { id: req.params.id, usuarioId: req.user.id }
  });
  if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(tarea);
};

// Actualizar tarea con reglas específicas
exports.updateTask = async (req, res) => {
  const tarea = await Tarea.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
  if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });

  const { titulo, descripcion, estado, fechaLimite } = req.body;

  // No se puede modificar una tarea completada
  if (tarea.estado === 'completada') {
    return res.status(400).json({ message: 'No se puede modificar una tarea completada' });
  }

  // Validaciones de cambio de estado
  if (estado) {
    if (tarea.estado === 'pendiente') {
      if (estado !== 'pendiente' && estado !== 'en progreso') {
        return res.status(400).json({ message: 'Desde "pendiente" solo se puede pasar a "en progreso" o mantenerse' });
      }
    }

    if (tarea.estado === 'en progreso') {
      if (estado === 'pendiente') {
        return res.status(400).json({ message: 'No se puede volver a "pendiente" desde "en progreso"' });
      }
      if (estado !== 'en progreso' && estado !== 'completada') {
        return res.status(400).json({ message: 'Desde "en progreso" solo se puede pasar a "completada" o mantenerse' });
      }
    }
  }

  try {
    await tarea.update({ titulo, descripcion, estado, fechaLimite });
    res.json({ message: 'Tarea actualizada', tarea });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
};

// Eliminar tarea (solo si está completada)
exports.deleteTask = async (req, res) => {
  const tarea = await Tarea.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
  if (!tarea || tarea.estado !== 'completada') {
    return res.status(400).json({ message: 'Solo se pueden eliminar tareas completadas' });
  }

  try {
    await tarea.destroy();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
};
