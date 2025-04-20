var express = require('express')
var router = express.Router();
var Usuario = require('../model/usuario')
var Auth = require("../middleware/auth")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {

    const error = req.query.error || null;
    const success = req.query.success || null;
    res.render('login', {success, error})
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
  
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  
    if (!senhaCorreta) {
      return res.redirect('/login?error=Senha incorreta');
    }
  
    if (remember === 'on') {
      const token = jwt.sign(
        {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo 
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
  
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
    req.session.tipo = usuario.tipo; 
    return res.redirect('/itens');
  });


module.exports = router;