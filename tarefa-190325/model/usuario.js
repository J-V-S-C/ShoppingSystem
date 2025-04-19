const connection = require('../db/db.config');
const db = require('../db/db.config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const buscarUsuarioPorEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length === 0) {
        return resolve(null);
      }

      resolve(results[0]);
    });
  });
};

const criarUsuario = (email, senha, nome, sobrenome) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err) return reject(err);

      const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)';
      db.query(query, [nome, sobrenome, email, hash], (err, result) => {
        if (err) return reject(err);

        resolve(result.insertId); 
      });
    });
  });
};

module.exports = {
  buscarUsuarioPorEmail,
  criarUsuario
};
