var express = require('express')
var router = express.Router();
var Usuario = require('../model/usuario')
var Auth = require("../middleware/auth")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/', function (req, res, next) {

    const error = req.query.error || null;
    const success = req.query.success || null;
    if (error) {
        res.render('login', { error });
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
        return res.redirect('/login?error=Usuário não encontrado');
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
              
              res.cookie('email', email, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
              });
              
        }
        req.session.usuarioId = usuario.id;
        req.session.autenticado = true;
        return res.redirect('/itens');
    } else {
        return res.redirect('/login?error=Senha incorreta');
    }
});


module.exports = router;