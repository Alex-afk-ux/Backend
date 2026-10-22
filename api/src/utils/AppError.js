// Error "controlat": el codi HTTP, un codi curt per al client i, opcionalment, detalls per camp.
class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = AppError;
