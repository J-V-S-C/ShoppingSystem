
var express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

class Auth {
    static verificarAutenticacao(req, res, next) {
        const token = req.cookies.token;

        if (token) {
            try {
                const payload = jwt.verify(token, JWT_SECRET);
                req.usuario = payload;
                return next();
            } catch (err) {
                return res.redirect('/login?error=Token inválido ou expirado');
            }
        }

        if (req.session && req.session.autenticado) {
            return next(); 
        }

        return res.redirect('/login?error=Você precisa estar logado');
    }
}

module.exports = Auth