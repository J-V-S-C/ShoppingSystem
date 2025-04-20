const express = require('express');
const router = express.Router();

const Categorias = require('../model/categorias');
const Auth = require('../middleware/auth');

router.get('/', Auth.verificarAutenticacao, Auth.verificarAdmin, async (req, res) => {
  try {
    const categorias = await Categorias.buscarCategorias();
    res.render('categorias', {
      categorias,
      success: req.query.success || null,
      error: req.query.error || null
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.redirect('/categorias?error=Erro ao carregar categorias');
  }
});

router.post('/criar', Auth.verificarAutenticacao, Auth.verificarAdmin, async (req, res) => {
  const { nome } = req.body;

  try {
    await Categorias.criarCategorias(nome);
    res.redirect('/categorias?success=Categoria criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.redirect('/categorias?error=Erro ao criar categoria.');
  }
});

router.post('/deletar/:id', Auth.verificarAutenticacao, Auth.verificarAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    await Categorias.deletarCategorias(id);
    res.redirect('/categorias?success=Categoria excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.redirect('/categorias?error=Erro ao deletar categoria.');
  }
});

module.exports = router;
