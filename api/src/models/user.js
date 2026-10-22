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
      unique: true, // índex únic a MongoDB (no és un validador de Mongoose)
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "L'email no té un format vàlid"],
    },
    // Només es guarda el hash de bcrypt; mai la contrasenya en text pla
    passwordHash: {
      type: String,
      required: [true, 'El hash de la contrasenya és obligatori'],
      select: false, // no surt a les consultes (find, findById...)
    },
    role: {
      type: String,
      enum: {
        values: ['client', 'admin'],
        message: '{VALUE} no és un rol vàlid',
      },
      default: 'client',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // select:false no afecta un document recent creat amb save();
      // aquesta transformació assegura que passwordHash no surt mai a res.json()
      transform: (doc, ret) => {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
