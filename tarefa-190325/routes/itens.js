var express = require('express')
var router = express.Router()

var Itens = require('../model/itens')

router.get('/', function(req, res) {
    res.render('itens');
})

router.post("/", async function(req, res, next){
    const {} = req.body;
})

module.exports = router