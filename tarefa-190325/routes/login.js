var express = require('express')
var router = express.Router();

var Usuario = require('../model/usuario')
var Auth = require("../middleware/auth")

router.get('/', function (req, res, next) {

    const erro = req.query.erro || null;
    const success = req.query.success || null;
    if (erro) {
        res.render('login', { erro });
        return
    }
    if( success){
        res.render('login', {success})
        return
    }
    res.render('login')
});

router.get('/logout', Auth.verificarAutenticacao, function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/posts');
        }
        res.redirect('/login');
    });
})


router.post('/', async function (req, res, next) {

    const { email, senha } = req.body;
    const usuario = await Usuario.buscarUsuarioPorEmail(email)

    if (!usuario) {
        return res.redirect('/login?erro=Usuário não encontrado');
    }

    if (usuario.senha === senha) {
        req.session.usuarioId = usuario.id;
        req.session.autenticado = true;

        return res.redirect('/posts');
    } else {
        return res.redirect('/login?erro=Senha incorreta');
    }
})


module.exports = router;