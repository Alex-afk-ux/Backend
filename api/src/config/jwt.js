// Configuració del JWT. Es llegeix de process.env en el moment de cridar-la
// (index.js ja ha carregat index.env abans d'arribar aquí).
const MIN_SECRET_LENGTH = 32;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET no està definit o és massa curt (mínim ${MIN_SECRET_LENGTH} caràcters). Revisa index.env`
    );
  }
  return secret;
};

const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN || '1h';

// Només s'accepta HS256: evita que un token amb un altre algorisme (p. ex. "none") sigui acceptat
const JWT_ALGORITHM = 'HS256';

module.exports = { getJwtSecret, getJwtExpiresIn, JWT_ALGORITHM };
