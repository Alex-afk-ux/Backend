const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.post('/', productController.createProduct);        // crear
router.get('/', productController.getProducts);           // listar todos
router.get('/:id', productController.getProductById);     // obtener uno
router.put('/:id', productController.updateProduct);      // modificar
router.delete('/:id', productController.deleteProduct);   // borrar

module.exports = router;