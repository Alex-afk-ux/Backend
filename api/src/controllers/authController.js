const authService = require('../services/authService');

// REGISTRE
const register = async (req, res) => {
  const { user, token } = await authService.register(req.body || {});
  res.status(201).json({ success: true, data: { user, token } });
};

// LOGIN
const login = async (req, res) => {
  const { user, token } = await authService.login(req.body || {});
  res.status(200).json({ success: true, data: { user, token } });
};

// PERFIL (ruta protegida): l'usuari el posa el middleware authenticate
const me = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { register, login, me };
