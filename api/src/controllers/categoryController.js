const categoryService = require('../services/categoryService');
const AppError = require('../utils/AppError');

const notFound = () => new AppError(404, 'NOT_FOUND', 'Categoria no trobada');

// CREAR
const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
};

// OBTENIR TOTS
const getCategories = async (req, res) => {
  const { data, pagination } = await categoryService.getCategories(req.query);
  res.status(200).json({ success: true, data, pagination });
};

// OBTENIR UN
const getCategoryById = async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) throw notFound();
  res.status(200).json({ success: true, data: category });
};

// MODIFICAR
const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  if (!category) throw notFound();
  res.status(200).json({ success: true, data: category });
};

// ESBORRAR
const deleteCategory = async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  if (!category) throw notFound();
  res.status(204).send();
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
