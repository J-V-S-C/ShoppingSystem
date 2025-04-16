var express = require('express')
var router = express.Router()

var Pedidos = require('../model/pedidos')
var Auth = require("../middleware/auth")

router.get('/', Auth.verificarAutenticacao, async function(req, res, next) {
    const response = await Pedidos.buscarPedidos() 
    res.render('posts', { pedidos: response });
})

module.exports = router