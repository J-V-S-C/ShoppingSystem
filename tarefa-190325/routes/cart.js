const express = require('express');
const router = express.Router();

const Itens = require('../model/itens');
const Auth = require('../middleware/auth');

router.get('/', async function (req, res) {
  const Cart = req.session.cart || [];

  const itensAtualizados = await Promise.all(
    Cart.map(async (carrinhoItem) => {
      const [itemAtualizado] = await Itens.buscarItensPorID(carrinhoItem.id);
      return {
        ...carrinhoItem,
        estoque: itemAtualizado.estoque,
        estoqueRestante: itemAtualizado.estoque - carrinhoItem.quantidade
      };
    })
  );

  res.render('cart', {
    itens: itensAtualizados,
    error: req.query.error || null,
    success: req.query.success || null
  });
});



router.post('/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const Cart = req.session.cart;
    
    const quantidade = parseInt(req.body.quantidade);
    const item_id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(item_id);

    if (!item) {
      return res.redirect('/itens?error=Item não encontrado.');
    }

    const cartItem = Cart.find(i => i.id === item_id);
    if (cartItem && cartItem.quantidade >= item.estoque) {
      return res.redirect('/cart?error=Estoque insuficiente para adicionar mais.');
    }
    
    
    if (cartItem) {
      cartItem.quantidade += quantidade;
    } else {
      item.quantidade = quantidade;
      item.precoUnitario = item.preco;
      Cart.push(item);
    }   
    res.redirect('/itens?success=Item adicionado ao carrinho com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.redirect('/itens?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/adicionar/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const Cart = req.session.cart;
    
    const id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(id);

    const carrinhoItem = Cart.find(i => i.id === id);
    if (!carrinhoItem) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    if (carrinhoItem.quantidade >= item.estoque) {
      return res.redirect('/cart?error=Estoque insuficiente.');
    }

    carrinhoItem.quantidade += 1;
 

    res.redirect('/cart?success=Item adicionado ao carrinho!');
  } catch (error) {
    console.error('Erro ao adicionar quantidade:', error);
    res.redirect('/cart?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/remover/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    const Cart = req.session.cart;
    
    const id = parseInt(req.params.id);

    const carrinhoItem = Cart.find(i => i.id === id);
    if (!carrinhoItem || carrinhoItem.quantidade <= 0) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    carrinhoItem.quantidade -= 1;

    if (carrinhoItem.quantidade === 0) {
      req.session.cart = Cart.filter(i => i.id !== id);
    }

    res.redirect('/cart?success=Item removido do carrinho!');
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.redirect('/cart?error=Erro ao remover item do carrinho.');
  }
});



module.exports = router;
