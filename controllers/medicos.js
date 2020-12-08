const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try{

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        res.json(500).json({
            ok: false,
            msg: "Contacte con el administrador"
        });
    }

}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try{

        const medicoDB = await Medico.findById( mid );

        if( !medicoDB ) {
            return res.json({
                ok: false,
                msg: 'No existe un médico con ese id'
            });
        }

        //const { usuario, hospital, ...campos } = req.body;
        const cambiosMedico =  {
            ...req.body, 
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, {new: true} );

        res.status(200).json({
            ok: true,
            Medico: medicoActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarMedico = async (req, res = response) => {

    const mid = req.params.id;

    try{

        const medicoDB = await Medico.findById( mid );

        if( !medicoDB ) {
            res.status(404).json({
                ok: false,
                msg: 'Medico not found'
            })
        }

        await Medico.findByIdAndDelete( mid );

        res.status(200).json({
            ok: true,
            msg: 'Médico borrado'
        })

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })

    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}