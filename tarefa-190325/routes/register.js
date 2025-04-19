var express = require('express')
var router = express.Router();

var Usuario = require("../model/usuario")

router.get("/", function(req, res, next) {
    const error = req.query.error || null;
    if (error) {
        res.render('register', { error });
        return
    }
    res.render('register')
})

router.post("/", async function(req, res) {
    const { email, senha, nome, sobrenome } = req.body;
    const result = await Usuario.criarUsuario(email, senha, nome, sobrenome);
  
    if (result?.error) {
      if (result.error.code === 'ER_DUP_ENTRY') {
        return res.redirect("/register?error=Email já está em uso!");
      }
  
      return res.redirect("/register?error=Erro ao criar usuário!");
    }
  
    return res.redirect("/login?success=Usuário criado com sucesso! Faça login para continuar.");
  });
  

module.exports = router
