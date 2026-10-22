const Category = require('../models/Category');
const { parseListQuery, buildPagination } = require('../utils/queryParams');

// Camps pels quals es pot ordenar
const SORTABLE_FIELDS = ['name', 'slug', 'active', 'createdAt', 'updatedAt'];
// Ordenació alfabètica en català, sense distingir majúscules
const COLLATION = { locale: 'ca', strength: 2 };

// CREAR
const createCategory = async (categoryData) => {
  const newCategory = new Category(categoryData);
  return await newCategory.save();
};

// OBTENIR TOTES (amb filtres, ordenació i paginació)
const getCategories = async (query) => {
  const { filter, sort, page, limit, skip } = parseListQuery(query, {
    sortableFields: SORTABLE_FIELDS,
  });

  const [data, total] = await Promise.all([
    Category.find(filter).collation(COLLATION).sort(sort).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination(page, limit, total) };
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