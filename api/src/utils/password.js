const bcrypt = require('bcrypt');
const AppError = require('./AppError');

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72; // bcrypt ignora tot el que passa de 72 bytes

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

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

module.exports = { validatePassword, hashPassword, SALT_ROUNDS };
