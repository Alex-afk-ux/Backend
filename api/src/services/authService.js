const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const { SALT_ROUNDS } = require('../utils/password');
const userService = require('./userService');
const { getJwtSecret, getJwtExpiresIn, JWT_ALGORITHM } = require('../config/jwt');

const LOGIN_FIELDS = ['email', 'password'];

// Hash fals per comparar sempre amb bcrypt encara que l'email no existeixi:
// així el temps de resposta no revela si un email està registrat.
const DUMMY_HASH = bcrypt.hashSync('contrasenya-que-no-existeix', SALT_ROUNDS);

// Missatge únic per a email inexistent, contrasenya incorrecta o usuari inactiu
const invalidCredentials = () =>
  new AppError(401, 'INVALID_CREDENTIALS', 'Email o contrasenya incorrectes');

// Genera el JWT. El payload només porta l'identificador (sub) i el rol; mai la contrasenya.
const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, getJwtSecret(), {
    algorithm: JWT_ALGORITHM,
    expiresIn: getJwtExpiresIn(),
  });

// REGISTRE: reutilitza la creació d'usuari (validacions + hash bcrypt + role=client)
const register = async (body) => {
  const user = await userService.createUser(body);
  return { user, token: signToken(user) };
};

// LOGIN
const login = async (body) => {
  const invalidFields = Object.keys(body).filter((key) => !LOGIN_FIELDS.includes(key));
  if (invalidFields.length > 0) {
    throw new AppError(
      400,
      'FIELDS_NOT_ALLOWED',
      'La petició conté camps que no es poden enviar',
      invalidFields.map((field) => ({ field, message: 'Camp no permès' }))
    );
  }

  // Han de ser text: evita injeccions tipus { "email": { "$ne": null } }
  const missing = LOGIN_FIELDS.filter((f) => typeof body[f] !== 'string' || body[f] === '');
  if (missing.length > 0) {
    throw new AppError(
      422,
      'VALIDATION_ERROR',
      'Les dades no són vàlides',
      missing.map((field) => ({ field, message: 'Camp obligatori (text)' }))
    );
  }

  const email = body.email.trim().toLowerCase();

  // passwordHash té select:false, per això cal demanar-lo explícitament
  const user = await User.findOne({ email }).select('+passwordHash');

  const passwordOk = await bcrypt.compare(body.password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !passwordOk || !user.active) throw invalidCredentials();

  return { user, token: signToken(user) };
};

// Verifica un token i retorna l'usuari actiu associat (per al middleware)
const verifyToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, getJwtSecret(), { algorithms: [JWT_ALGORITHM] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError(401, 'TOKEN_EXPIRED', 'El token ha caducat');
    }
    throw new AppError(401, 'INVALID_TOKEN', 'El token no és vàlid');
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.active) {
    throw new AppError(401, 'INVALID_TOKEN', 'El token no és vàlid');
  }
  return user;
};

module.exports = { register, login, verifyToken, signToken };
