const db = require('../db/db.config')

const buscarPedidos = () => {

    return new Promise((resolve, reject) => {
        const query = "select * from pedidos";
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

module.exports = {
    buscarPedidos
}