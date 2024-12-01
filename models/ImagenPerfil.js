const { Schema, model } = require("mongoose");

const imgPerfilSchema = Schema({
    name: { type: String, require: true },
    url: { type: String, require: true }
})

// Exportación del modelo User para poder utilizarlo en otros archivos.
module.exports = model("ImgPerfil", imgPerfilSchema);