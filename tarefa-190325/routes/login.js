var express = require('express')
var router = express.Router();
var Usuario = require('../model/usuario')
var Auth = require("../middleware/auth")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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
        res.clearCookie('token');
        res.redirect('/login');

    });
})


router.post('/', async (req, res) => {
    const { email, senha, remember } = req.body;
    const usuario = await Usuario.buscarUsuarioPorEmail(email);

    if (!usuario) {
        return res.redirect('/login?erro=Usuário não encontrado');
    }

    if (usuario.senha === senha) {
        if(remember === 'on'){
      
            const token = jwt.sign({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }, JWT_SECRET, { expiresIn: '1d' });
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, 
                maxAge: 1000 * 60 * 60 * 24
            });
        }
        req.session.usuarioId = usuario.id;
        req.session.autenticado = true;
        return res.redirect('/itens');
    } else {
        return res.redirect('/login?erro=Senha incorreta');
    }
});


module.exports = router;