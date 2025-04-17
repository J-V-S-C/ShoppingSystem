var express = require('express')
var router = express.Router()

var Itens = require('../model/itens')

router.get('/', async function(req, res) {
    const response = await Itens.buscarItens() 
    res.render('itens', { itens: response});
})

router.get('/createItens', async function(req, res){
    res.render('createItens')
})
router.post("/createItens", async function(req, res, next){
    const { nome, descricao, preco, estoque, categoria_id } = req.body;
    
     const err = await Itens.criarItens(nome, descricao, preco, estoque, categoria_id)
        if(err) {
            return res.redirect("/itens?erro=Erro ao criar Item!");
        }
    
        return res.redirect("/itens")
})

router.post('/deletar/:id', async function(req, res){
    try {
        await Itens.deletarItem(req.params.id);
        res.redirect('/itens');
      } catch (error) {
        console.error("Erro ao deletar item:", error);
        res.status(500).send("Erro ao deletar item.");
      }})
module.exports = router