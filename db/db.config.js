const mySql = require('mysql2')

const connection = mySql.createConnection({
    host: process.env.HOST,
    //usar sudo docker inspect moodle-atv ip-address
    user: process.env.ROOT,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

connection.connect((err)=> {
    if (err) {
        console.error("Erro ao conectar ao banco de dados: ", err)
        return
    }

    console.log("Conexão efetuada")
})

module.exports = connection;

/*
    host: "localhost",
    //usar sudo docker inspect moodle-atv ip-address
    user: 'root',
    port: 3306,
    password: '12345',
    database: 'moodle'
*/