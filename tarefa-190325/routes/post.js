var express = require('express')
var router = express.Router()

var Pedidos = require('../model/pedidos')
var Auth = require("../middleware/auth")

router.get('/', Auth.verificarAutenticacao, async function(req, res, next) {
    const response = await Pedidos.buscarPedidos() 
    res.render('posts', { pedidos: response });
})

router.post('/', Auth.verificarAutenticacao, async function(req, res){
    const usuarioId = req.session.usuarioId || req.usuario.id
    const cart = req.session.cart || []

    if(cart.length === 0){
        return res.redirect('/cart?error=Seu carrinho está vazio!')
    }

    try{
        const valor_total = cart.reduce((total, item)=> {
            return total + item.precoUnitario * item.quantidade;
          }, 0);
        const pedidoId = await Pedidos.criarPedido(Date.now(),usuarioId, valor_total)
        await Pedidos.inserirItensNoPedido(pedidoId, cart)

        req.session.cart = []
        return res.redirect('/cart?success=Pedido criado com sucesso!')
    }catch(err){
        return res.redirect('/cart?error=Erro ao criar pedido!')
    }
})

module.exports = router