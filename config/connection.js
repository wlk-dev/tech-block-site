const Sequelize = require('sequelize');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

let sequelize;
if (process.env.MYSQL_URL) {
    sequelize = new Sequelize(process.env.MYSQL_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}

module.exports = sequelize;