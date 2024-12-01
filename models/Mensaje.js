const { Schema, model } = require("mongoose");

const mensajeSchema = Schema({
    name: { type: String, require: true },
    msj: { type: String, require: true },
    timeStamp: { type: Date, require: true }
})

// Exportación del modelo User para poder utilizarlo en otros archivos.
module.exports = model("Mensaje", mensajeSchema);