const connection = require('../db/db.config');
const db = require('../db/db.config')

const buscarUsuarioPorEmail = (email)=> {

    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        db.query(query, [email], (err, results) => {
          if (err) {
            reject(err); 
            return;
          }
    
          if (results.length === 0) {
            resolve(null);  
            return;
          }
    
          resolve(results[0]); 
        });
      });
    };

const criarUsuario = (email, senha, nome, sobrenome) => {

  return new Promise((resolve, reject) => {
  const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)';

    db.query(query, [nome, sobrenome, email, senha], (err, result) => {
      if(err) {
        resolve({erro: err});
        return 
      }
  
      if(result.length === 0) {
        resolve(null);
        return;
      }
  
      resolve(result[0])
    })
  })
} 

    module.exports = {
    buscarUsuarioPorEmail,
      criarUsuario
  };

