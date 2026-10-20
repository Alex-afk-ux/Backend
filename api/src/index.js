const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'index.env') });

const express = require('express');
const connectDB = require('./api/categories/config/db');
const productRoutes = require('./api/categories//routes/productRoutes');
const categoryRoutes = require('./api/categories//routes/categoryRoutes');

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));