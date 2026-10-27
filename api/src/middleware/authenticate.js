const authService = require('../services/authService');
const AppError = require('../utils/AppError');

// Exigeix la capçalera  Authorization: Bearer <token>
// Si és vàlid, deixa l'usuari a req.user i continua; si no, 401.
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError(401, 'UNAUTHORIZED', 'Cal enviar el token: Authorization: Bearer <token>');
  }

  req.user = await authService.verifyToken(token);
  next();
};

module.exports = { authenticate };
