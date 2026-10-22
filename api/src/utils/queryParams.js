const AppError = require('./AppError');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100; // límit màxim de resultats per pàgina

// Escapa els caràcters especials perquè "a.*" es busqui com a text i no com a expressió regular
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Enter positiu estricte: "1", "25"... (no "0", "-1", "1.5", "abc", "1e3")
const parsePositiveInt = (value, field, errors) => {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    errors.push({ field, message: 'Ha de ser un enter positiu' });
    return undefined;
  }
  return Number(value);
};

// Valida req.query i el converteix en filtre, ordenació i paginació per a Mongoose.
// sortableFields: llista de camps permesos per ordenar (cap camp sensible)
const parseListQuery = (query, { sortableFields, defaultSort = '-createdAt' }) => {
  const errors = [];
  const filter = {};

  // ?active=true|false
  if (query.active !== undefined) {
    if (query.active === 'true') filter.active = true;
    else if (query.active === 'false') filter.active = false;
    else errors.push({ field: 'active', message: "Ha de ser 'true' o 'false'" });
  }

  // ?name=text  (coincidència parcial, sense distingir majúscules)
  if (query.name !== undefined) {
    if (typeof query.name !== 'string' || query.name.trim() === '') {
      errors.push({ field: 'name', message: 'Ha de ser un text no buit' });
    } else {
      filter.name = { $regex: escapeRegex(query.name.trim()), $options: 'i' };
    }
  }

  // ?sort=name  |  ?sort=-createdAt  |  ?sort=name,-createdAt
  const sort = {};
  const sortParam = query.sort !== undefined ? query.sort : defaultSort;
  if (typeof sortParam !== 'string' || sortParam === '') {
    errors.push({ field: 'sort', message: 'Ha de ser un text, per exemple name o -createdAt' });
  } else {
    for (const part of sortParam.split(',')) {
      const desc = part.startsWith('-');
      const field = desc ? part.slice(1) : part;
      if (!sortableFields.includes(field)) {
        errors.push({
          field: 'sort',
          message: `Camp no permès: ${field}. Permesos: ${sortableFields.join(', ')}`,
        });
      } else {
        sort[field] = desc ? -1 : 1;
      }
    }
  }
  // Desempat per _id perquè la paginació sigui estable
  if (!('_id' in sort)) sort._id = 1;

  // ?page=2&limit=5
  const page = query.page !== undefined ? parsePositiveInt(query.page, 'page', errors) : 1;
  let limit = query.limit !== undefined ? parsePositiveInt(query.limit, 'limit', errors) : DEFAULT_LIMIT;

  if (errors.length > 0) {
    throw new AppError(400, 'INVALID_QUERY', 'Els paràmetres de consulta no són vàlids', errors);
  }

  limit = Math.min(limit, MAX_LIMIT);
  return { filter, sort, page, limit, skip: (page - 1) * limit };
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = { parseListQuery, buildPagination, MAX_LIMIT, DEFAULT_LIMIT };
