const express = require('express');
const router = express.Router();

const Itens = require('../model/itens');
const Auth = require('../middleware/auth');

let Cart = [];

router.get('/', async function (req, res) {
  res.render('cart', {
    itens: Cart,
    error: req.query.error || null,
    success: req.query.success || null
  });
});

router.post('/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const quantidade = parseInt(req.body.quantidade);
    const item_id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(item_id);

    if (!item) {
      return res.redirect('/itens?error=Item não encontrado.');
    }

    const cartItem = Cart.find(i => i.id === item_id);

    if (cartItem) {
      cartItem.quantidade += quantidade;
    } else {
      item.quantidade = quantidade;
      Cart.push(item);
    }

    const novoEstoque = item.estoque - quantidade;
    if (novoEstoque < 0) {
      return res.redirect('/itens?error=Estoque insuficiente.');
    }

    await Itens.atualizarItem(
      item_id,
      item.nome,
      item.descricao,
      item.preco,
      novoEstoque,
      item.categoria_id,
      item.usuario_id
    );

    res.redirect('/itens?success=Item adicionado ao carrinho com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.redirect('/itens?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/adicionar/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(id);

    const carrinhoItem = Cart.find(i => i.id === id);
    if (!carrinhoItem) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    if (item.estoque <= 0) {
      return res.redirect('/cart?error=Estoque insuficiente.');
    }

    carrinhoItem.quantidade += 1;
    await Itens.atualizarItem(
      id,
      item.nome,
      item.descricao,
      item.preco,
      item.estoque - 1,
      item.categoria_id,
      item.usuario_id
    );

    res.redirect('/cart?success=Item adicionado ao carrinho!');
  } catch (error) {
    console.error('Erro ao adicionar quantidade:', error);
    res.redirect('/cart?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/remover/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(id);

    const carrinhoItem = Cart.find(i => i.id === id);
    if (!carrinhoItem || carrinhoItem.quantidade <= 0) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    carrinhoItem.quantidade -= 1;

    if (carrinhoItem.quantidade === 0) {
      Cart = Cart.filter(i => i.id !== id);
    }

    await Itens.atualizarItem(
      id,
      item.nome,
      item.descricao,
      item.preco,
      item.estoque + 1,
      item.categoria_id,
      item.usuario_id
    );

    res.redirect('/cart?success=Item removido do carrinho!');
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.redirect('/cart?error=Erro ao remover item do carrinho.');
  }
});

module.exports = router;
