const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'index.env') });

const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('API Ecommerce en marxa'));

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));