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

const criarPedido = (dataCompra, valorTotal, usuarioId) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO pedidos (data_compra, valor_total, usuario_id) VALUES (?, ?, ?)';
        db.query(query, [dataCompra, valorTotal, usuarioId], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId); 
        });
        });
}

const inserirItensNoPedido = (pedidoId, itens ) => {
    return Promise.all(itens.map(item => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO pedidos_itens (pedido_id, item_id, quantidade, valor_venda) VALUES (?, ?, ?, ?)';
            db.query(query, [pedidoId, item.id, item.quantidade, item.preco], (err) => {
              if (err) return reject(err);
              resolve();})
        })
    }))
}

module.exports = {
    buscarPedidos,
    criarPedido,
    inserirItensNoPedido
}