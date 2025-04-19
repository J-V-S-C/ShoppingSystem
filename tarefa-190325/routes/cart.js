var express = require('express')
var router = express.Router()

var Itens = require('../model/itens')
var Auth = require('../middleware/auth')
var Cart = []

router.get('/',  async function(req, res) {
    const response = Cart
    res.render('cart', { itens: response, error: req.query.error || null });
  });
  
router.post('/:id', Auth.verificarAutenticacao, async function (req, res){
    try{
      const quantidade = req.body.quantidade;
      const item_id = parseInt(req.params.id)
      const [item] = await Itens.buscarItensPorID(item_id)
      if (!item) {
        return res.redirect('/itens?error=Item não encontrado.');
      }
      const cartItem = Cart.find(item => item.id === item_id)

      if (cartItem) {
        parseInt(cartItem.quantidade) += parseInt(quantidade);
      } else {
        item.quantidade = quantidade;
        Cart.push(item);
      }
      const novoEstoque = item.estoque - quantidade;
      if (novoEstoque < 0) {
        return res.redirect('/itens?error=Estoque insuficiente.');
      }
      await Itens.atualizarItem(item_id, item.nome, item.descricao, item.preco, novoEstoque, item.categoria_id, item.usario_id )
      res.status(201).redirect('/itens?success=Item adicionado ao carrinho com sucesso!')
    }catch(error){
      console.error('Erro ao adicionar item ao carrinho:', error);
      res.status(500).redirect('itens?error=Erro ao adicionar item ao carrinho.')
    }
  })

  router.post('/adicionar/:id', Auth.verificarAutenticacao, async function(req, res){
    try{
      const id = req.params.id
      const item = await Itens.buscarItensPorID(id)
      const estoqueItem = item.estoque - 1
      await Itens.atualizarItem(id, item.nome, item.descricao, item.preco, estoqueItem, item.categoria_id, item.usario_id)
      Cart.map(item => {
        if(item.id == id){
          item.quantidade +=1
        }
      })
      res.redirect('/cart?success=Item adicionado ao carrinho com sucesso!')

    }catch(error){
      console.error('Erro ao adicionar item ao carrinho:', error)
      res.status(500).redirect('itens?error=Erro ao adicionar item ao carrinho.')
    }
  })

  router.post('/remover/:id', Auth.verificarAutenticacao, async function(req, res){
    try{
      const id = req.params.id
      const item = Itens.buscarItensPorID(id)
      const estoqueItem = item.estoque + 1
      await Itens.atualizarItem(id, item.nome, item.descricao, item.preco, estoqueItem, item.categoria_id, item.usario_id)
      Cart.map(item => {
        if(item.id == id){
          item.quantidade -= 1
        }
      })
      res.redirect('/cart?success=Item removido do carrinho com sucesso!')
    }catch(error){
      console.error('Erro ao adicionar item ao carrinho:', error)
      res.status(500).redirect('itens?error=Erro ao adicionar item ao carrinho.')
    }
  })
  module.exports = router