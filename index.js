require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor express com
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json() );

// Base de datos 
dbConnection()




// nachowski
// NzNnheIyIzUfwcPW
// connect mongo atlas mongodb+srv://nachowski:NzNnheIyIzUfwcPW@cluster0.o6qwb.mongodb.net/hospitaldb

//Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos', require('./routes/medicos') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/todo', require('./routes/busquedas'));
app.use( '/api/uploads', require('./routes/uploads'));



app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT)
})