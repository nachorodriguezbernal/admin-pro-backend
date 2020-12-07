/*
    Hospitales
    ruta: api/hospitales
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getHospitales, crearHospital, actualizarHospital, borrarHospital} = require('../controllers/hospitales');

const router = Router();

router.get('/', getHospitales);

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearHospital);

router.put('/',[], actualizarHospital); 

router.delete('/', borrarHospital);

module.exports = router;