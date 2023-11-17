import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({

    MYSQL_host:process.env.MYSQL_HOST,
    MYSQL_user:process.env.MYSQL_USER,
    MYSQL_password:process.env.MYSQL_PASSWORD,
    MYSQL_database:process.env.MYSQL_DATABASE
});

console.log('BD Conectado');

export default connection;