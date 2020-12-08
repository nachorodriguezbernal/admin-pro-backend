/**
 * 
 * Path: api/login
 */


const { Router} = require('express');
const { login, goolgeSingIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post('/google', 
    [
        check('token', 'El el token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    goolgeSingIn
)

module.exports = router;