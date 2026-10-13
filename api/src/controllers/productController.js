const productService = require('../services/productService');

// CREAR
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body); // req.body = datos que envía el cliente
    res.status(201).json({ status: 'success', data: product });   // 201 = creado
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message }); // 400 = datos incorrectos
  }
};

// OBTENER TODOS
const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json({ status: 'success', data: products }); // 200 = todo bien
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message }); // 500 = error del servidor
  }
};

// OBTENER UNO
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id); // req.params.id = el id de la URL
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' }); // 404 = no existe
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// MODIFICAR
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// BORRAR
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producte no trobat' });
    }
    res.status(200).json({ status: 'success', message: 'Producte esborrat' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};