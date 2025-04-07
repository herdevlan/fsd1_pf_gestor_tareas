const { Tarea } = require('../../models');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  const { titulo, descripcion, fechaLimite } = req.body;
  try {
    const tarea = await Tarea.create({
      titulo,
      descripcion,
      fechaLimite,
      estado: 'pendiente',
      usuarioId: req.user.id
    });
    res.status(201).json({ message: 'Tarea creada exitosamente', task: tarea });
  } catch {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

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

exports.getOneTask = async (req, res) => {
  const tarea = await Tarea.findOne({
    where: { id: req.params.id, usuarioId: req.user.id }
  });
  if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(tarea);
};

exports.updateTask = async (req, res) => {
  const tarea = await Tarea.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
  if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });

  const { titulo, descripcion, estado, fechaLimite } = req.body;

  // Lógica de reglas de estado
  if (tarea.estado === 'completada') {
    return res.status(400).json({ message: 'No se puede modificar una tarea completada' });
  }

  if (estado === 'pendiente') {
    return res.status(400).json({ message: 'No se puede volver a estado pendiente' });
  }

  if (estado === 'completada' && tarea.estado !== 'en progreso') {
    return res.status(400).json({ message: 'Solo se puede completar una tarea en progreso' });
  }

  await tarea.update({ titulo, descripcion, estado, fechaLimite });
  res.json({ message: 'Tarea actualizada', tarea });
};

exports.deleteTask = async (req, res) => {
  const tarea = await Tarea.findOne({ where: { id: req.params.id, usuarioId: req.user.id } });
  if (!tarea || tarea.estado !== 'completada') {
    return res.status(400).json({ message: 'Solo se pueden eliminar tareas completadas' });
  }

  await tarea.destroy();
  res.json({ message: 'Tarea eliminada' });
};
