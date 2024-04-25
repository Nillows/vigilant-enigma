const Sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const kijiji = require('kijiji-scraper');
// https://github.com/mwpenny/kijiji-scraper
const axios = require('axios');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

const sequelize = require('./config/connection.js');

const routes = require('./routes/routes'); // Adjust the path as necessary

//const Game = require('./models/game.js');


// Route to serve the index.html file
app.use('/', routes);

sequelize.sync().then(() => {
    console.log("Database & tables created!");



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})
});
