
var express = require('express')
var router = express.Router()

class Auth {

    static verificarAutenticacao(req, res, next) {
        if (!req.session.autenticado) {
            return res.redirect('/login?erro=Você precisa estar logado');
        }
        next();  
    }
}


module.exports = Auth