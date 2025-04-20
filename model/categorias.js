const db = require('../db/db.config');

const buscarCategorias = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM categorias", [], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const buscarCategoriaPorID = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM categorias WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const criarCategorias = (nome) => {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO categorias (nome) VALUES (?)", [nome], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const deletarCategorias = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM categorias WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  buscarCategorias,
  buscarCategoriaPorID,
  criarCategorias,
  deletarCategorias
};
