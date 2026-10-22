// Genera dades FICTÍCIES per demostrar filtres, ordenació i paginació.
//   npm run seed         -> crea 25 categories i 25 usuaris de prova
//   npm run seed:clean   -> elimina només les dades creades per aquest script
// Només per a ús local.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'index.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Category = require('./models/Category');
const User = require('./models/user');

const DAY = 24 * 60 * 60 * 1000;
const CATEGORY_SLUG = /^seed-/;
const USER_EMAIL = /^seed-user-\d+@prova\.cat$/;

const categoryNames = [
  'Impermeables petits', 'Impermeables mitjans', 'Impermeables grans',
  'Accessoris de neteja', 'Accessoris de decoració', 'Bombes i filtres',
  'Alimentació tropical', 'Alimentació de rierol', 'Plantes aquàtiques',
  'Termòmetres', 'Escalfadors', 'Il·luminació LED', 'Aquaris petits',
  'Aquaris grans', 'Grava i sorra', 'Roques i troncs', 'Medicaments',
  'Condicionadors d\'aigua', 'Xarxes i salabres', 'Informació i guies',
  'Informació de producte', 'Ofertes de temporada', 'Novetats', 'Pack inici',
  'Regals',
];

const firstNames = [
  'Anna', 'Annabel', 'Joan', 'Marta', 'Pere', 'Laia', 'Jordi', 'Núria', 'Marc',
  'Hanna', 'Berta', 'Oriol', 'Clara', 'Pau', 'Sílvia', 'Joanna', 'Roger', 'Mireia',
  'Albert', 'Carla', 'Biel', 'Helena', 'Arnau', 'Irene', 'Ferran',
];
const lastNames = ['Prova', 'Test', 'Demo', 'Fictici', 'Exemple'];

const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const pad = (n) => String(n + 1).padStart(2, '0');

const clean = async () => {
  const c = await Category.deleteMany({ slug: CATEGORY_SLUG });
  const u = await User.deleteMany({ email: USER_EMAIL });
  console.log(`Eliminades ${c.deletedCount} categories i ${u.deletedCount} usuaris de prova`);
};

const seed = async () => {
  await clean();
  const now = Date.now();

  // Cada 4a categoria/usuari queda inactiu; createdAt escalonat un dia per poder provar l'ordenació
  const categories = categoryNames.map((name, i) => {
    const date = new Date(now - (categoryNames.length - i) * DAY);
    return {
      name,
      slug: `seed-${slugify(name)}`,
      description: `Categoria de prova ${pad(i)}`,
      active: i % 4 !== 3,
      createdAt: date,
      updatedAt: date,
    };
  });
  await Category.insertMany(categories);

  // Una sola contrasenya fictícia per a tots, hashejada amb bcrypt (mai en text pla)
  const passwordHash = await bcrypt.hash('contrasenya-segura-1', 12);
  const users = firstNames.map((first, i) => {
    const date = new Date(now - (firstNames.length - i) * DAY);
    return {
      name: `${first} ${lastNames[i % lastNames.length]}`,
      email: `seed-user-${pad(i)}@prova.cat`,
      passwordHash,
      role: 'client',
      active: i % 4 !== 3,
      createdAt: date,
      updatedAt: date,
    };
  });
  await User.insertMany(users);

  console.log(`Creades ${categories.length} categories i ${users.length} usuaris de prova`);
};

(async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Aquest script no es pot executar en producció');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (process.argv.includes('--clean')) await clean();
    else await seed();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
