const db = require('../db/db.config')

const buscarItens = () => {

    return new Promise((resolve, reject) => {
        const query = "select * from itens";
        db.query(query, [], (err, results)=> {
            if (err) {
                return reject(err)
            }
            if (results.length === 0) {
                resolve(null);  
                return;
              }
        
              resolve(results[0]); 
        })
    })
}

const criarItens = (nome, descricao, preco, estoque, categoria_id) => {
    return new Promise((resolve, reject)=> {
        const query = "insert into itens (nome, descricao, preco, estoque, categoria_id) values (?, ?, ?, ?, ?)";
        db.query(query, [nome, descricao, preco, estoque, categoria_id], (err, result) => {
            if(err){
                reject(err)
                return err
            }

            if(result.length === 0){
                resolve(null)
                return;

            }

            resolve(result[0])
        })
    })
}

module.exports = {
    buscarItens,
    criarItens
}