var express = require('express')
var router = express.Router()

var Itens = require('../model/itens')
var Auth = require('../middleware/auth')
var Usuarios = require('../model/usuario')

const Cart = require('../model/cart');
const Categorias = require('../model/categorias');




router.get('/', Auth.verificarAutenticacao, async function(req, res) {
  try {
    const usuario_id = req.usuario.id;

    const [itens, categorias, carrinho] = await Promise.all([
      Itens.buscarItens(),
      Categorias.buscarCategorias(),
      Cart.buscarPorUsuario(usuario_id)
    ]);

    const categoriasMap = categorias.reduce((map, cat) => {
      map[cat.id] = cat.nome;
      return map;
    }, {});

    const itensComDados = itens.map(item => {
      const reservado = carrinho.find(c => c.id === item.id)?.quantidade || 0;
      return {
        ...item,
        disponivel: item.estoque - reservado,
        categoria_nome: categoriasMap[item.categoria_id] || 'Sem categoria'
      };
    });

    res.render('itens', {
      itens: itensComDados,
      error: req.query.error || null,
      success: req.query.success || null
    });

  } catch (error) {
    console.error('Erro ao carregar itens:', error);
    res.redirect('/itens?error=Erro ao carregar itens.');
  }
});



   

router.get('/createItens', Auth.verificarAutenticacao, async function(req, res) {
  try {
    const categorias = await Categorias.buscarCategorias();
    res.render('createItens', { categorias });
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    res.redirect("/itens?error=Erro ao carregar formulário de criação!");
  }
});

router.post("/createItens", async function(req, res) {
  const { nome, descricao, preco, estoque, categoria_id } = req.body;
  try {
    const email = req.cookies.email;
    const usuario = await Usuarios.buscarUsuarioPorEmail(email);
    const id = usuario.id;

    await Itens.criarItens(nome, descricao, preco, estoque, categoria_id, id);
    return res.redirect("/itens?success=Item criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar item:", err);
    return res.redirect("/itens?error=Erro ao criar Item!");
  }
});




router.get('/editar/:id', Auth.verificarAutenticacao, Auth.verificarOwner, async (req, res) => {
  const id = req.params.id;
  try {
    const [response, categorias] = await Promise.all([
      Itens.buscarItensPorID(id),
      Categorias.buscarCategorias()
    ]);

    res.render('updateItem', {
      item: response[0],
      categorias
    });
  } catch (err) {
    res.redirect('/itens?error=Erro ao buscar item para edição!');
  }
});

  router.post('/editar/:id',Auth.verificarAutenticacao, Auth.verificarOwner, async (req, res) => {
    const id = req.params.id;
    const { nome, descricao, preco, estoque, categoria_id } = req.body;
    try {
        await Itens.atualizarItem(id, nome, descricao, preco, estoque, categoria_id);
        return res.redirect("/itens?success=Item editado com sucesso!");
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

