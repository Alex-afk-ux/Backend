const userService = require('../services/userService');
const AppError = require('../utils/AppError');

const notFound = () => new AppError(404, 'NOT_FOUND', 'Usuari no trobat');

// CREAR
const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
};

// OBTENIR TOTS
const getUsers = async (req, res) => {
  const { data, pagination } = await userService.getUsers(req.query);
  res.status(200).json({ success: true, data, pagination });
};

// OBTENIR UN
const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) throw notFound();
  res.status(200).json({ success: true, data: user });
};

// MODIFICAR
const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) throw notFound();
  res.status(200).json({ success: true, data: user });
};

// DESACTIVAR (baixa lògica: active=false)
const deactivateUser = async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);
  if (!user) throw notFound();
  res.status(204).send();
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
};
