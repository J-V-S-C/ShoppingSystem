const db = require('../db/db.config')

const buscarItens = () => {

    return new Promise((resolve, reject) => {
        const query = "select * from itens";
        db.query(query, [], (err, results)=> {
            if (err) {
                return reject(err)
            }
         
        
              resolve(results); 
        })
    })
}

const buscarItensPorID = (id) => {

    return new Promise((resolve, reject) => {
        const query = "select * from itens WHERE id = ?";
        db.query(query, [id], (err, results)=> {
            if (err) {
                return reject(err)
            }
         
        
              resolve(results); 
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

const atualizarItem = (id, nome, descricao, preco, estoque, categoria_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE itens 
        SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria_id = ? 
        WHERE id = ?
      `;
      db.query(query, [nome, descricao, preco, estoque, categoria_id, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  
  const deletarItem = (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM itens WHERE id = ?";
      db.query(query, [id], (err, result) => {
        if (err) {
            reject(err);
            return err
        }
        resolve(result);
      });
    });
  };

module.exports = {
    buscarItens,
    buscarItensPorID,
    criarItens,
    atualizarItem,
    deletarItem

}