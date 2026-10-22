const bcrypt = require('bcrypt');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const { parseListQuery, buildPagination } = require('../utils/queryParams');

// Camps pels quals es pot ordenar (mai passwordHash)
const SORTABLE_FIELDS = ['name', 'email', 'role', 'active', 'createdAt', 'updatedAt'];
// Ordenació alfabètica en català, sense distingir majúscules
const COLLATION = { locale: 'ca', strength: 2 };

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72; // bcrypt ignora tot el que passa de 72 bytes

// Camps que el client pot enviar. role, active i passwordHash MAI vénen del body.
const CREATE_FIELDS = ['name', 'email', 'password'];
const UPDATE_FIELDS = ['name', 'email', 'password'];

// Rebutja qualsevol camp que no estigui a la llista de permesos -> 400
const assertAllowedFields = (body, allowed) => {
  const invalid = Object.keys(body).filter((key) => !allowed.includes(key));
  if (invalid.length > 0) {
    throw new AppError(
      400,
      'FIELDS_NOT_ALLOWED',
      'La petició conté camps que no es poden enviar',
      invalid.map((field) => ({ field, message: 'Camp no permès' }))
    );
  }
};

// Error de validació de la contrasenya -> 422
const passwordError = (message) =>
  new AppError(422, 'VALIDATION_ERROR', 'Les dades no són vàlides', [
    { field: 'password', message },
  ]);

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw passwordError(`Ha de tenir almenys ${MIN_PASSWORD_LENGTH} caràcters`);
  }
  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    throw passwordError(`No pot superar els ${MAX_PASSWORD_BYTES} bytes`);
  }
};

// CREAR
const createUser = async (body) => {
  assertAllowedFields(body, CREATE_FIELDS);
  validatePassword(body.password);

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);

  const newUser = new User({
    name: body.name,
    email: body.email,
    passwordHash,
    role: 'client', // el servidor decideix el rol
  });
  return await newUser.save();
};

// OBTENIR TOTS (amb filtres, ordenació i paginació)
const getUsers = async (query) => {
  const { filter, sort, page, limit, skip } = parseListQuery(query, {
    sortableFields: SORTABLE_FIELDS,
  });

  const [data, total] = await Promise.all([
    User.find(filter).collation(COLLATION).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return { data, pagination: buildPagination(page, limit, total) };
};

// OBTENIR UN
const getUserById = async (id) => {
  return await User.findById(id);
};

// MODIFICAR (només camps de la llista)
const updateUser = async (id, body) => {
  assertAllowedFields(body, UPDATE_FIELDS);

  const changes = {};
  if (body.name !== undefined) changes.name = body.name;
  if (body.email !== undefined) changes.email = body.email;
  if (body.password !== undefined) {
    validatePassword(body.password);
    changes.passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  }

  if (Object.keys(changes).length === 0) {
    throw new AppError(400, 'NO_FIELDS', 'No hi ha cap camp per modificar');
  }

  return await User.findByIdAndUpdate(id, changes, {
    new: true,
    runValidators: true,
  });
};

// DESACTIVAR (baixa lògica, no s'esborra el document)
const deactivateUser = async (id) => {
  return await User.findByIdAndUpdate(id, { active: false }, { new: true });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
};
