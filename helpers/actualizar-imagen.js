const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const fs = require('fs');

const borrarImagen = ( path ) => {

    if ( fs.existsSync( path ) ){
        // Borrar imagen antigua.
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async ( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch( tipo ) {

        case 'medico':
            const medico = await Medico.findById(id);
            if( !medico ) {
                console.log( 'No es un médico' );
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen( pathViejo );

            medico.img = nombreArchivo;
            await medico.save();
            return true;

        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if( !hospital ) {
                console.log( 'No es un hospital' );
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejo );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if( !usuario ) {
                console.log( 'No es un usuario' );
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
        break;

    }
}

module.exports = {
    actualizarImagen
}