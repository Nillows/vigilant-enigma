const Sequelize = require('sequelize');
const sequelize = require('../config/connection'); // Ensure this path correctly points to where your Sequelize instance is configured

const Game = sequelize.define('Game', {
  // Define attributes to match your schema.sql
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true // Set true if you want the ID to auto-increment
  },
  game_title: {
    type: Sequelize.STRING(2048), // Matching VARCHAR(2048) in SQL
    allowNull: false,
  },
  game_console: {
    type: Sequelize.STRING(100), // Matching VARCHAR(100) in SQL
    // Add other configurations as needed
  },
  loose_val: {
    type: Sequelize.DECIMAL(10, 2), // Matching DECIMAL in SQL, adjust precision and scale as needed
    // Add other configurations as needed
  },
  complete_val: {
    type: Sequelize.DECIMAL(10, 2), // Matching DECIMAL in SQL, adjust precision and scale as needed
    // Add other configurations as needed
  },
  new_val: {
    type: Sequelize.DECIMAL(10, 2), // Matching DECIMAL in SQL, adjust precision and scale as needed
    // Add other configurations as needed
  },
  pull_date: {
    type: Sequelize.DATE,
    // Add other configurations as needed
  },
  Link: {
    type: Sequelize.STRING(2048), // Matching VARCHAR(2048) as specified for the URL
    // Add other configurations as needed
  }
}, {
  timestamps: false // Disable Sequelize's automatic timestamping
});

module.exports = Game;
