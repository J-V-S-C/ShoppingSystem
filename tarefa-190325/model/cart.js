const db = require('../db/db.config');

const buscarPorUsuario = (usuario_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.item_id AS id,             
          c.quantidade,
          c.valor_venda,
          i.nome,
          i.descricao,
          i.preco,
          i.estoque,
          i.categoria_id
        FROM carrinho c
        JOIN itens i ON c.item_id = i.id
        WHERE c.usuario_id = ?
      `;
  
      db.query(query, [usuario_id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };
  

const buscarPorUsuarioEItem = (usuario_id, item_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM carrinho WHERE usuario_id = ? AND item_id = ?
    `;

    db.query(query, [usuario_id, item_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null); 
    });
  });
};

const inserir = ({ usuario_id, item_id, quantidade, valor_venda }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO carrinho (usuario_id, item_id, quantidade, valor_venda)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [usuario_id, item_id, quantidade, valor_venda], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const atualizarQuantidade = (usuario_id, item_id, quantidade) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE carrinho SET quantidade = ? WHERE usuario_id = ? AND item_id = ?
    `;

    db.query(query, [quantidade, usuario_id, item_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const removerItem = (usuario_id, item_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM carrinho WHERE usuario_id = ? AND item_id = ?
    `;

    db.query(query, [usuario_id, item_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const limparCarrinho = (usuario_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM carrinho WHERE usuario_id = ?
    `;

    db.query(query, [usuario_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  buscarPorUsuario,
  buscarPorUsuarioEItem,
  inserir,
  atualizarQuantidade,
  removerItem,
  limparCarrinho
};
