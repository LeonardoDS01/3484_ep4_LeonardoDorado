const bcrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");

const usuarioSchema = Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true }
})

usuarioSchema.methods.encryptPassword = (password) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcrypt.hash(password, salt);
};

usuarioSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password);
};

// Exportación del modelo User para poder utilizarlo en otros archivos.
module.exports = model("User", usuarioSchema);