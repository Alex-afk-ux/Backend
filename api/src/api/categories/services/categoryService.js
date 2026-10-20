const Category = require('../models/Category');

// CREAR
const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

// OBTENIR TOTES
const getCategories = async () => {
  return await Category.find();
};

// OBTENIR UNA
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// MODIFICAR
const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
    runValidators: true,
  });
};

// ESBORRAR
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};