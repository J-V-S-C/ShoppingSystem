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
    const cart = await require('../model/cart').buscarPorUsuario(usuarioId);

if (!cart || cart.length === 0) {
  return res.redirect('/cart?error=Seu carrinho está vazio!');
}

    try{
        const valor_total = cart.reduce((total, item)=> {
            return total + item.valor_venda * item.quantidade;
          }, 0);
          const dataAtual = new Date().toISOString().slice(0, 19).replace('T', ' ');

          const pedidoId = await Pedidos.criarPedido(dataAtual, valor_total, usuarioId);

        await Pedidos.inserirItensNoPedido(pedidoId, cart)

        
        await require('../model/cart').limparCarrinho(usuarioId);
        return res.redirect('/itens?success=Pedido criado com sucesso!')
    }catch(err){
        console.error('Erro ao criar pedido:', err)
        return res.redirect('/cart?error=Erro ao criar pedido!')
    }
})

module.exports = router