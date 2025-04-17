var express = require('express')
var router = express.Router();

var Usuario = require("../model/usuario")

router.get("/", function(req, res, next) {
    const erro = req.query.erro || null;
    if (erro) {
        res.render('register', { erro });
        return
    }
    res.render('register')
})

router.post("/", async function(req, res, next) {
    const {email, senha, nome, sobrenome} = req.body;
    const err = await Usuario.criarUsuario(email, senha, nome, sobrenome)
    if(err) {
        return res.redirect("/register?erro=Erro ao criar usuário!");
    }

    return res.redirect("/login")
})

module.exports = router
