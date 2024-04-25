DROP DATABASE IF EXISTS Pricechart_db;
CREATE DATABASE Pricechart_db;

USE Pricechart_db;

CREATE TABLE Games (
  id INT NOT NULL AUTO_INCREMENT,
  game_title VARCHAR(2048),
  game_console VARCHAR(100),
  loose_val DECIMAL(10, 2),
  complete_val DECIMAL(10, 2),
  new_val DECIMAL(10, 2),
  pull_date DATE,
  Link VARCHAR(2048),  -- Increased the length to 2048 characters
  PRIMARY KEY (id)
);
