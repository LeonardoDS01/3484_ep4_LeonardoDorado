const mongoose = require("mongoose");

const conectarDB = async () => {
  mongoose.connect("mongodb://localhost:27017/EP4_3484_Dorado")
    .then(() => console.log("Conexión a MongoDB establecida"))
    .catch((err) => console.error("Error al conectar a MongoDB:", err));
};

module.exports = conectarDB;
