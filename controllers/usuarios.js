const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),  
    
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password, nombre } = req.body;

    try{

        const existeEmail = await Usuario.findOne({ email });

        if(existeEmail) {
            return res.status(400).json({ 
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        const usuarioId = usuario.id;

        // Guardar usuario
        await usuario.save();

        const token =  await generarJWT( usuarioId );
    
        res.json({
            ok: true,
            usuario,
            token
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({ 
            ok: false,
            msg: 'Error inesperado... revisar Logs'
        })
    }
}

const actualizarUsuario = async (req, res = response) => {

    // TODO: Validar Token y comprobar si es el usuario correcto.
    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }

        const { password, google, email, ...campos } = req.body;

        if( usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });

            if( existeEmail ) {
                return res.status(400).json({ 
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true} );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }

        const usuarioBorrado = await Usuario.findByIdAndRemove(uid);

        res.status(200).json({
            od: true,
            usuario: usuarioBorrado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}