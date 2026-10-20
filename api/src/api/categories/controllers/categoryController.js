const categoryService = require('../services/categoryService');

// Tracta els errors de Mongo/Mongoose.
// El 11000 és l'error d'índex únic (slug duplicat): no és una validació de Mongoose.
const handleError = (res, error) => {
  if (error.code === 11000) {
    return res
      .status(409)
      .json({ status: 'error', message: 'Ja existeix una categoria amb aquest slug' });
  }
  return res.status(400).json({ status: 'error', message: error.message });
};

// CREAR
const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    handleError(res, error);
  }
};

// OBTENIR TOTES
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// OBTENIR UNA
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    handleError(res, error);
  }
};

// MODIFICAR
const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    }
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    handleError(res, error);
  }
};

// ESBORRAR
const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Categoria no trobada' });
    }
    res.status(200).json({ status: 'success', message: 'Categoria esborrada' });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};