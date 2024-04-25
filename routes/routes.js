const path = require('path');
const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const kijiji = require('kijiji-scraper');
const Game = require('../models/game'); // Ensure this path correctly points to where your Sequelize instance is configured

// Route to serve the index.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route to handle Kijiji ad searches
router.get('/search-ads', (req, res) => {
    const locationId = parseInt(req.query.locationId) || 1700006;
    const searchQuery = req.query.q || "Nintendo";

    const options = {
        minResults: 80
    };
    const params = {
        locationId: locationId,
        categoryId: 0,
        q: searchQuery,
        sortByName: "dateAsc",
    };

    kijiji.search(params, options).then(ads => {
        res.json(ads);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error occurred during ads search.');
    });
});

// Route to serve the index2.html file for /database
router.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index2.html'));
});


// Route to serve the index3.html file for main
router.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index3.html'));
});


// Route to handle searching for games
router.get('/api/search-games', (req, res) => {
    const title = req.query.title ? req.query.title.toLowerCase() : '';
    const consoles = req.query.consoles;

    let whereCondition = {
        [Sequelize.Op.or]: [ // Search for the title in both the game_title and Link columns
            { game_title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('game_title')), 'LIKE', '%' + title + '%') },
            { Link: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Link')), 'LIKE', '%' + title + '%') }
        ]
    };

    // If 'consoles' is not 'all', adjust the search condition to include specific consoles
    if (consoles !== 'all') {
        let consoleArray = consoles.split(',').map(console => console.trim().toLowerCase());
        whereCondition.game_console = {
            [Sequelize.Op.or]: consoleArray.map(consoleValue => {
                // Here we use exact matching instead of LIKE to prevent false positives
                return { [Sequelize.Op.eq]: consoleValue };
            })
        };
    }

    Game.findAll({ where: whereCondition })
        .then(games => res.json(games))
        .catch(error => {
            console.log('Search Error:', error);
            res.status(500).send('Error occurred during the database search.');
        });
});


// Export the router
module.exports = router;