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

module.exports = {
    buscarItens
}