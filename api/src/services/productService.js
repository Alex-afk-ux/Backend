const Product = require('../models/Product');

// CREAR un producto
const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save(); // guarda en la base de datos
};

// OBTENER todos los productos
const getProducts = async () => {
  return await Product.find(); // busca todos
};

// OBTENER un producto por su id
const getProductById = async (id) => {
  return await Product.findById(id);
};

// MODIFICAR un producto
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    new: true,           // devuelve el producto ya cambiado
  });
};

// BORRAR un producto
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