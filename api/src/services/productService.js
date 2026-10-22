const Product = require('../models/Product');

// CREAR
const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// OBTENER TODOS
const getProducts = async () => {
  return await Product.find().populate('category');
};

// OBTENER UNO
const getProductById = async (id) => {
  return await Product.findById(id).populate('category');
};

// MODIFICAR
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  }).populate('category');
};

// BORRAR
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};