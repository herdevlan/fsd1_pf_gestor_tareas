require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('../models');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/tasks.routes'));

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await sequelize.authenticate();
  console.log('Base de datos conectada');
});
