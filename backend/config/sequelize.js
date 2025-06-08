const { Sequelize } = require('sequelize');

// pushing variables directly into the code, not recommended for production
const sequelize = new Sequelize(
  'atmosync',     
  'root',         
  '6103',         
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306     
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
