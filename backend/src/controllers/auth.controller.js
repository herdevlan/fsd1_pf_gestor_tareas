const { Usuario } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await Usuario.create({ nombre, email, password: hash });
    res.status(201).json({ message: 'Usuario creado', user });
  } catch (e) {
    res.status(500).json({ message: 'Error al registrar', error: e.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.json({ message: 'Login exitoso', token });
  }  catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
  
};

exports.me = async (req, res) => {
  const user = await Usuario.findByPk(req.user.id, {
    attributes: ['id', 'nombre', 'email']
  });
  res.json(user);
};
