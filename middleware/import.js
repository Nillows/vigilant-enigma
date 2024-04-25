// Importing necessary modules
require('dotenv').config({ path: '../.env' });
const csvtojson = require('csvtojson');
const mysql = require('mysql');
const fs = require('fs'); // File system module for checking file existence

// Database credentials from .env file
const hostname = process.env.HOSTNAME;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const databasename = process.env.DB_NAME;
const csvFilePath = process.env.CSV_FILE_PATH;

// Print out environment variables for debugging
console.log('Environment Variables:', {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  HOSTNAME: process.env.HOSTNAME,
  CSV_FILE_PATH: process.env.CSV_FILE_PATH,
});

// Establish connection to the database
let con = mysql.createConnection({
  host: hostname,
  user: username,
  password: password,
  database: databasename,
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err.message);
    process.exit(1); // Exit if cannot connect
  }
  console.log('Connected to the MySQL server.');
});

// Utility function to check if a value is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Function to process CSV data and insert it into the database
function processCsvData(source) {
  let insertPromises = [];

  source.forEach((item, i) => {
    console.log(`Processing row ${i + 1}`);
    let game_title = item['game'] || 'Unknown Title';
    let game_console = item['console'] || 'Unknown Console';
    let loose_val = isNumeric(item['loose_val']) ? item['loose_val'] : 0;
    let complete_val = isNumeric(item['complete_val']) ? item['complete_val'] : 0;
    let new_val = isNumeric(item['new_val']) ? item['new_val'] : 0;
    let pull_date = item['pull_date'] || '2000-01-01';
    let Link = item['Link'] || 'NO URL Found';

    let insertStatement = `INSERT INTO Games (game_title, game_console, loose_val, complete_val, new_val, pull_date, Link) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let items = [game_title, game_console, loose_val, complete_val, new_val, pull_date, Link];

    let insertPromise = new Promise((resolve, reject) => {
      con.query(insertStatement, items, (err, results, fields) => {
          if (err) {
              console.log(`Error inserting item at row ${i + 1}:`, err);
              reject(err); // Reject the promise with the error
          } else {
              console.log(`Successfully inserted item at row ${i + 1}`);
              resolve(); // Resolve the promise successfully
          }
      });
    });
    insertPromises.push(insertPromise);
  });

  return Promise.all(insertPromises);
}

// Check if the CSV file exists at the specified path
console.log('Attempting to read file at path:', csvFilePath);
fs.access(csvFilePath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('File does not exist:', csvFilePath);
  } else {
    console.log('File found:', csvFilePath);
    // Read and process the CSV file
    csvtojson()
      .fromFile(csvFilePath)
      .then((source) => {
        processCsvData(source)
          .then(() => {
            console.log('All items stored into the database successfully');
            con.end(); // Close the connection when done
          })
          .catch((err) => {
            console.error('An error occurred while inserting data:', err);
            con.end(); // Close the connection in case of error
          });
      })
      .catch((err) => {
        console.error('Error reading CSV:', err);
        con.end(); // Close the connection in case of error reading CSV
      });
  }
});