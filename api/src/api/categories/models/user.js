const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nom és obligatori'],
      trim: true,
      minlength: [2, 'El nom ha de tenir almenys 2 caràcters'],
      maxlength: [50, 'El nom no pot superar els 50 caràcters'],
    },
    email: {
      type: String,
      required: [true, "L'email és obligatori"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "L'email no té un format vàlid"],
    },
    password: {
      type: String,
      required: [true, 'La contrasenya és obligatòria'],
      minlength: [6, 'La contrasenya ha de tenir almenys 6 caràcters'],
      select: false, // no es retorna a les consultes per defecte
    },
    role: {
      type: String,
      enum: {
        values: ['client', 'admin'],
        message: '{VALUE} no és un rol vàlid',
      },
      default: 'client',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);