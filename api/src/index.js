const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'index.env') });

const connectDB = require('./config/db');
const app = require('./app');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
