const mySql = require('mysql2')

const connection = mySql.createConnection({
    host: process.env.DB_HOST,
    //usar sudo docker inspect moodle-atv ip-address
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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