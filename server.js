const express = require('express');
const multer = require('multer');
const fs = require('fs');
const conectarDB = require("./config/db");
const PORT = require("./config/global").port;
const moment = require('moment');
const bcrypt = require("bcryptjs");
const path = require("path");
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Models
const Usuario =require("./models/Usuario");
const Mensaje =require("./models/Mensaje");
const ImgPerfil =require("./models/ImagenPerfil");

app.use(express.json());
app.use(express.static('public'));

// conexion a MongoDB
conectarDB();

//Multer
const upload = multer({dest:'public/img'})


//*******************************************************************************/
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//USUARIO - Registrar
app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;

    console.log(`Registro: \n ${name} ${email} ${password}`)
    
    try {
        //Verificar si ya existe
        let user = await Usuario.findOne({email});
        if (user) {
            return res.status(404).json({ message: "El usuario ya existe" });
        }
        
        //Encriptar Password
        const hashedPassword = await bcrypt.hash(password,10);
        user = new Usuario({
            name,
            email,
            password: hashedPassword,
        });

        //Registrar Usuario nuevo
        await user.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(400).json({ message: "Error al registrar usuario", error });
    }
})

//USUARIO - Login
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    console.log(`Registro: \n ${email} ${password}`)

    try {
        // Validar Usuario por email
        const user = await Usuario.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        //Comparar contaseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        //Successful
        res.status(200).json({ message: "Login exitoso" });
    } catch (error) {
        res.status(400).json({ message: "Error en el login", error });
    }
})

//MENSAJE - Create
app.post("/msj",async(req,res)=>{
    const {name,msj,timeStamp} = req.body;
    console.log(`Mensaje: \n ${name} - ${msj} - ${timeStamp}`)

    try {
        // Validar timeStamp
        if (!moment(timeStamp, moment.ISO_8601, true).isValid()) {
            console.log('Formato de timeStamp inválido')
            return res.status(400).json({ message: 'Formato de timeStamp inválido' });
        }

        mensaje = new Mensaje({
            name,
            msj,
            timeStamp,
        });

        //Registrar Mensaje nuevo
        await mensaje.save();
        console.log('Mensaje registrado exitosamente')
        res.status(201).json({ message: "Mensaje registrado exitosamente" });
    } catch (error) {
        console.log("Error en el guardado del mensaje",error)
        res.status(400).json({ message: "Error en el guardado del mensaje", error });
    }
})

//MENSAJE - Get
app.get("/msj",async(req,res)=>{
    try {
        const mensajes = await Mensaje.find();
        res.status(200).send(mensajes);
    } catch (error) {
        res.status(400).json({ message: "Error en la obtencion de los mensajes", error });
    }

})

//IMG PERFIL - Create
app.post("/imgPerfil", upload.single('file'), async(req,res)=>{
    const {name,url} = req.body;

    console.log(req.file);
    const newPath= saveImage(req.file,name)
        
    console.log(`Mensaje: \n ${name} - ${url}`)
    try {
        imgperfil= new ImgPerfil({
            name,
            url:newPath,
        });

        await imgperfil.save();

        console.log('Img registrado exitosamente')
        res.status(201).json({ message: "Img registrado exitosamente" });
    } catch (error) {
        console.log("Error en el guardado de la img perfil",error)
        res.status(400).json({ message: "Error en el guardado de la img perfil", error });
    }
})

//*******************************************************************************/
function saveImage(file,name){
    const newPath = `./public/img/${name}${path.extname(file.originalname)}`;
    fs.renameSync(file.path, newPath);
    return newPath
}
//*******************************************************************************/




// Almacenamiento de usuarios en memoria (para propósitos de ejemplo)
const users = {};  

// Manejar conexiones de los clientes
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Escuchar evento de login desde el cliente
    socket.on('login', (username, callback) => {
        if (Object.values(users).includes(username)) {
            callback({ success: false, message: 'Nombre de usuario ya en uso' });
        } else {
            users[socket.id] = username;  // Asignar el nombre de usuario al socket
            callback({ success: true, username });
            io.emit('notification', `${username} se ha unido al chat`);
            console.log(`${username} se ha conectado`);
            
        }
    });

    // Manejar los mensajes enviados por el cliente
    socket.on('chat message', (msg) => {
        const username = users[socket.id];
        if (username) {
            io.emit('chat message', { user: username, text: msg });
        }
    });

    // Manejar la desconexión de un usuario
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            io.emit('notification', `${username} se ha desconectado`);
            delete users[socket.id];  // Eliminar al usuario de la lista de conectados
            console.log(`${username} se ha desconectado`);
        }
    });
});

//*******************************************************************************/
// configuracion del puerto
server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});