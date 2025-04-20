var express = require('express')
var router = express.Router()

var Pedidos = require('../model/pedidos')
var Auth = require("../middleware/auth")

router.get('/', Auth.verificarAutenticacao, Auth.verificarAdmin, async function(req, res) {
    try {
      const response = await Pedidos.buscarPedidos();
      const { error, success } = req.query;
      res.render('posts', {
        pedidos: response,
        error,
        success
      });
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      res.render('posts', {
        pedidos: [],
        error: 'Erro ao carregar pedidos.',
        success: null
      });
    }
  });
  

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

router.post('/aprovar', Auth.verificarAutenticacao, Auth.verificarAdmin, async function(req, res){
    const pedidoId = req.body.pedidoId;
    try {
      await Pedidos.atualizarStatusPedido(pedidoId, 'aprovado');
      res.redirect('/posts?success=Pedido aprovado com sucesso!');
    } catch (err) {
      console.error(err);
      res.redirect('/posts?error=Erro ao aprovar pedido!');
    }
  });
  
  router.post('/rejeitar', Auth.verificarAutenticacao, Auth.verificarAdmin, async function(req, res) {
    const pedidoId = req.body.pedidoId;
    try {
      await Pedidos.atualizarStatusPedido(pedidoId, 'rejeitado');
      res.redirect('/posts?success=Pedido rejeitado com sucesso!');
    } catch (err) {
      console.error('Erro ao rejeitar pedido:', err);
      res.redirect('/posts?error=Erro ao rejeitar o pedido!');
    }
  });
  
  router.post('/pendente', Auth.verificarAutenticacao, Auth.verificarAdmin,async function(req, res) {
    const pedidoId = req.body.pedidoId;
    try {
      await Pedidos.atualizarStatusPedido(pedidoId, 'pendente');
      res.redirect('/posts?success=Pedido marcado como pendente!');
    } catch (err) {
      console.error('Erro ao marcar como pendente:', err);
      res.redirect('/posts?error=Erro ao marcar o pedido como pendente!');
    }
  });
  
  router.get('/deletar', Auth.verificarAutenticacao, Auth.verificarAdmin, async function(req, res) {
    const pedidoId = req.query.id;
    try {
      await Pedidos.deletarPedido(pedidoId);
      res.redirect('/posts?success=Pedido excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao deletar pedido:', err);
      res.redirect('/posts?error=Erro ao deletar pedido!');
    }
  });
  

  
module.exports = router