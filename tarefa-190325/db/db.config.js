const mySql = require('mysql2')

const connection = mySql.createConnection({
    host: "172.17.0.2",
    //usar sudo docker inspect moodle-atv ip-address
    user: 'root',
    port: 3306,
    password: '12345678',
    database: 'sgpBrasil'
})

connection.connect((err)=> {
    if (err) {
        console.error("Erro ao conectar ao banco de dados: ", err)
        return
    }

    console.log("Conexão efetuada")
})

module.exports = connection;