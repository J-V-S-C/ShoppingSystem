var express = require('express')
var router = express.Router()

var Itens = require('../model/itens')
var Auth = require('../middleware/auth')
var Usuarios = require('../model/usuario')

const Cart = require('../model/cart');

router.get('/', Auth.verificarAutenticacao, async function(req, res) {
  try {
    const usuario_id = req.usuario.id;

    const response = await Itens.buscarItens();            
    const carrinho = await Cart.buscarPorUsuario(usuario_id);

    const itensComDisponivel = response.map(item => {
      const carrinhoItem = carrinho.find(c => c.id === item.id);
      const reservado = carrinhoItem ? carrinhoItem.quantidade : 0;
      return {
        ...item,
        disponivel: item.estoque - reservado
      };
    });

    res.render('itens', {
      itens: itensComDisponivel,
      error: req.query.error || null,
      success: req.query.success || null
    });
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
    res.redirect('/itens?error=Erro ao carregar itens.');
  }
});


  

router.get('/createItens',Auth.verificarAutenticacao , async function(req, res){
    res.render('createItens')
})
router.post("/createItens", async function(req, res, next){
    const { nome, descricao, preco, estoque, categoria_id } = req.body;
    const email = req.cookies.email
    const usuario = await Usuarios.buscarUsuarioPorEmail(email)
    const id = usuario.id
    const err = await Itens.criarItens(nome, descricao, preco, estoque, categoria_id, id)
        if(err) {
            return res.redirect("/itens?error=Erro ao criar Item!");
        }
    
        return res.redirect("/itens?success=Item criado com sucesso!")
})

router.get('/editar/:id',Auth.verificarAutenticacao, Auth.verificarOwner, async (req, res) => {
    const id = req.params.id;
    try {
        const response = await Itens.buscarItensPorID(id)
        res.render('updateItem', { item: response[0] });
    } catch (err) {
      res.redirect('/itens?error=Erro ao buscar item para edição!');
    }
  });

  router.post('/editar/:id',Auth.verificarAutenticacao, Auth.verificarOwner, async (req, res) => {
    const id = req.params.id;
    const { nome, descricao, preco, estoque, categoria_id } = req.body;
    try {
        await Itens.atualizarItem(id, nome, descricao, preco, estoque, categoria_id);
        return res.redirect("/itens");
      } catch (error) {
        console.error("Erro ao editar item:", error);
        return res.redirect("/itens?error=Erro ao editar item!");
      }
      
  });
  
  

router.post('/deletar/:id',Auth.verificarAutenticacao, Auth.verificarOwner, async function(req, res){
    try {
        await Itens.deletarItem(req.params.id);
        res.redirect('/itens');
      } catch (error) {
        res.status(500).send("Erro ao deletar item.");
      }})

module.exports = router

