# EP4 Leonardo Dorado

### Descripción:
  En este proyecto se podrá realizar:
    - Login
    - Registro
    - Mensajeria a tiempo real
    - Personalizar la foto de perfil
  Siendo estas funciones integradas con MongoDB

### APIS
  #####Login [post-  /login]
  #####Registro [post-  /register]
  #####Mensajería [post/get-  /msj]
  #####Img Perfil [post-  /imgPerfil]

### Instalación
  1. Clona el repositorio:
   git clone https://github.com/LeonardoDS01/3484_ep4_LeonardoDorado.git

  2. Navega al directorio:
   cd proyecto

  3. Instala las dependencias:
   npm install

### Ejecución
  ##### Prerequisitos: 
    - Revisar la conexion a la base de datos '/config/db.js'

  1. Ejecutar el comando 'node server'
  2. Ingresar a la ruta [http://localhost:4000/]
  3. Realizar inicio de sesion o registrarse.
     - Al registrarse se guardará su informacion en la base de datos, con la contraseña cifrada
     - Al iniciar sesion se validará y descifrará la contraseña
  5. Chatear en tiempo real.
     - Podrá chatear con multiples personas y estas podrás revisar todo el historial desde que inician sesion
  7. Personalizar foto de perfil
     - Primero seleccionar la imagen y luego dar al botón 'Cambiar Imagen'.
     - Esto cambiará la foto y guardará un historico en la base de datos.
