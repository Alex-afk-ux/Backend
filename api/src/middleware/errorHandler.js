const AppError = require('../utils/AppError');

// Ruta inexistent (ha d'anar després de totes les rutes)
const notFoundHandler = (req, res, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', `Ruta no trobada: ${req.method} ${req.originalUrl}`));
};

// Converteix qualsevol error en { statusCode, code, message, details }
const normalizeError = (err) => {
  // 1. Errors que hem llançat nosaltres
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      details: err.details,
    };
  }

  // 2. Validació de Mongoose (required, min, enum, match...) -> 422
  if (err.name === 'ValidationError' && err.errors) {
    return {
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Les dades no són vàlides',
      details: Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      })),
    };
  }

  // 3. ID o valor amb tipus incorrecte (CastError) -> 400
  if (err.name === 'CastError') {
    const isId = err.path === '_id';
    return {
      statusCode: 400,
      code: isId ? 'INVALID_ID' : 'INVALID_DATA',
      message: isId ? "L'identificador no és vàlid" : `El valor del camp ${err.path} no és vàlid`,
      details: [{ field: err.path, message: 'Valor incorrecte' }],
    };
  }

  // 4. Índex únic de MongoDB (slug, email...) -> 409
  //    No és una validació de Mongoose. No incloem el valor duplicat a la resposta.
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    return {
      statusCode: 409,
      code: 'DUPLICATE_KEY',
      message: 'Ja existeix un registre amb aquest valor',
      details: fields.map((field) => ({ field, message: 'Valor duplicat' })),
    };
  }

  // 5. JSON mal format al cos de la petició -> 400
  if (err.type === 'entity.parse.failed') {
    return {
      statusCode: 400,
      code: 'INVALID_JSON',
      message: 'El cos de la petició no és un JSON vàlid',
    };
  }

  // 6. Qualsevol altre error és inesperat -> 500 (sense detalls interns)
  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Error intern del servidor',
  };
};

// Middleware global: ha de tenir 4 paràmetres i anar l'últim
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode, code, message, details } = normalizeError(err);

  // La traça només es veu al servidor (consola), mai a la resposta
  if (statusCode === 500) {
    console.error(err);
  }

  const error = { code, message };
  if (details && details.length > 0) error.details = details;

  res.status(statusCode).json({ success: false, error });
};

module.exports = { notFoundHandler, errorHandler };
