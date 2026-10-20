const mongoose = require('mongoose');

// Valors permesos (exportats perquè el frontend els pugui reutilitzar als selects)
const TARGET_SPECIES = ['peix pallasso', 'goldfish', 'betta', 'guppy', 'disc', 'cíclid', 'altres'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nom és obligatori'],
      trim: true,
      minlength: [2, 'El nom ha de tenir almenys 2 caràcters'],
      maxlength: [100, 'El nom no pot superar els 100 caràcters'],
    },
    price: {
      type: Number,
      required: [true, 'El preu és obligatori'],
      min: [0, 'El preu no pot ser negatiu'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "L'estoc no pot ser negatiu"],
      validate: {
        validator: Number.isInteger,
        message: "L'estoc ha de ser un nombre enter",
      },
    },
    targetSpecies: {
      type: String,
      enum: {
        values: TARGET_SPECIES,
        message: '{VALUE} no és una espècie vàlida',
      },
    },
    size: {
      type: String,
      enum: {
        values: SIZES,
        message: '{VALUE} no és una talla vàlida',
      },
    },
    color: {
      type: String,
      trim: true,
      maxlength: [30, 'El color no pot superar els 30 caràcters'],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.TARGET_SPECIES = TARGET_SPECIES;
module.exports.SIZES = SIZES;