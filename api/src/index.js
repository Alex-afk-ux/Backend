const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'index.env') });

const connectDB = require('./config/db');
const app = require('./app');
const { getJwtSecret } = require('./config/jwt');

// Si falta JWT_SECRET, l'API no arrenca (millor fallar aviat que signar tokens amb un secret feble)
getJwtSecret();

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
