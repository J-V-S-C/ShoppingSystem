const express = require('express');
const router = express.Router();

const Itens = require('../model/itens');
const Auth = require('../middleware/auth');
const Cart = require('../model/cart'); 

router.get('/', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const usuario_id = req.usuario.id;
    const itens = await Cart.buscarPorUsuario(usuario_id);

    const itensAtualizados = itens.map(item => ({
      ...item,
      precoUnitario: item.valor_venda,
      estoqueRestante: item.estoque - item.quantidade
    }));
    

    res.render('cart', {
      itens: itensAtualizados,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Erro ao listar carrinho:', error);
    res.redirect('/itens?error=Erro ao carregar carrinho.');
  }
});




router.post('/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const usuario_id = req.usuario.id;
    const quantidade = parseInt(req.body.quantidade);
    const item_id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(item_id);

    if (!item) {
      return res.redirect('/itens?error=Item não encontrado.');
    }

    const carrinhoExistente = await Cart.buscarPorUsuarioEItem(usuario_id, item_id);

    if (carrinhoExistente) {
      const novaQuantidade = carrinhoExistente.quantidade + quantidade;

      if (novaQuantidade > item.estoque) {
        return res.redirect('/itens?error=Estoque insuficiente.');
      }

      await Cart.atualizarQuantidade(usuario_id, item_id, novaQuantidade);
    } else {
      if (quantidade > item.estoque) {
        return res.redirect('/itens?error=Estoque insuficiente.');
      }

      await Cart.inserir({
        usuario_id,
        item_id,
        quantidade,
        valor_venda: item.preco
      });
    }

    res.redirect('/itens?success=Item adicionado ao carrinho com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    res.redirect('/itens?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/adicionar/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const usuario_id = req.usuario.id;
    const item_id = parseInt(req.params.id);
    const [item] = await Itens.buscarItensPorID(item_id);

    if (!item) {
      return res.redirect('/cart?error=Item não encontrado.');
    }

    const carrinhoItem = await Cart.buscarPorUsuarioEItem(usuario_id, item_id);

    if (!carrinhoItem) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    if (carrinhoItem.quantidade >= item.estoque) {
      return res.redirect('/cart?error=Estoque insuficiente.');
    }

    await Cart.atualizarQuantidade(usuario_id, item_id, carrinhoItem.quantidade + 1);

    res.redirect('/cart?success=Item adicionado ao carrinho!');
  } catch (error) {
    console.error('Erro ao adicionar quantidade:', error);
    res.redirect('/cart?error=Erro ao adicionar item ao carrinho.');
  }
});

router.post('/remover/:id', Auth.verificarAutenticacao, async function (req, res) {
  try {
    const usuario_id = req.usuario.id;
    const item_id = parseInt(req.params.id);

    const carrinhoItem = await Cart.buscarPorUsuarioEItem(usuario_id, item_id);

    if (!carrinhoItem || carrinhoItem.quantidade <= 0) {
      return res.redirect('/cart?error=Item não está no carrinho.');
    }

    if (carrinhoItem.quantidade === 1) {
      await Cart.removerItem(usuario_id, item_id);
    } else {
      await Cart.atualizarQuantidade(usuario_id, item_id, carrinhoItem.quantidade - 1);
    }

    res.redirect('/cart?success=Item removido do carrinho!');
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    res.redirect('/cart?error=Erro ao remover item do carrinho.');
  }
});




module.exports = router;
