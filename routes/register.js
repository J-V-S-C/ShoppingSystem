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
  const { email, senha, confirmarSenha, nome, sobrenome, isAdmin, adminSecret } = req.body;

  if (senha !== confirmarSenha) {
    return res.redirect("/register?error=Senhas não batem!");
  }

  let tipo = 'comum';

  if (isAdmin === 'on') {
    const senhaMestre = process.env.ADMIN_PASSWORD; 
    if (adminSecret !== senhaMestre) {
      return res.redirect("/register?error=Senha de admin incorreta!");
    }
    tipo = 'admin';
  }

  const result = await Usuario.criarUsuario(email, senha, nome, sobrenome, tipo);

  if (result?.error) {
    if (result.error.code === 'ER_DUP_ENTRY') {
      return res.redirect("/register?error=Email já está em uso!");
    }
    return res.redirect("/register?error=Erro ao criar usuário!");
  }

  return res.redirect("/login?success=Usuário criado com sucesso!");
});

  

module.exports = router
