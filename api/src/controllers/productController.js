const productService = require('../services/productService');
const AppError = require('../utils/AppError');

const notFound = () => new AppError(404, 'NOT_FOUND', 'Producte no trobat');

// CREAR
const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ success: true, data: product });
};

// OBTENIR TOTS
const getProducts = async (req, res) => {
  const items = await productService.getProducts();
  res.status(200).json({ success: true, data: items });
};

// OBTENIR UN
const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) throw notFound();
  res.status(200).json({ success: true, data: product });
};

// MODIFICAR
const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) throw notFound();
  res.status(200).json({ success: true, data: product });
};

// ESBORRAR
const deleteProduct = async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) throw notFound();
  res.status(204).send();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
