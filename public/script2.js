// script2.js - Client Side

// Define a dictionary of console identifiers mapped to arrays of associated keywords
const consoleKeywords = {


    "nintendo-64": ["n64", "nintendo 64", "nintendo64", "64 nintendo", "nintendo-64", "n 64"],
    "gamecube": ["gamecube", "nintendo gamecube", "gc", "nintendo gc", "game cube"],
    "wii": ["wii", "nintendo wii", "wii console", "nintendo wi", "wi"],
    "wii-u": ["wii u", "wiiu", "nintendo wii u", "nintendowiiu", "wii u console"],
    "nintendo-switch": ["switch", "nintendo switch", "nintendoswitch", "n-switch", "nsw"],
    "gameboy-advance": ["gba", "nintendo gba", "advance gameboy", "nintendo gameboy advance", "nintendo game boy advance", "gameboy advance", "game boy advance"],
    "gameboy": ["gameboy", "gb", "game boy", "nintendo gameboy", "nintendo gb"],
    "nintendo-ds": ["nds", "nintendo ds", "nintendods", "ds", "dual screen"],
    "virtual-boy": ["virtual boy", "vb", "nintendo vb", "nintendo virtual boy", "virtualboy"],
    "game-&-watch": ["game and watch", "gnw", "game n watch", "game&watch", "nintendo game & watch"],
    "super-nintendo": ["snes", "super nintendo", "super nes", "nintendo snes", "super nintendo entertainment system"],
    "nes": ["nes", "nintendo entertainment system", "nintendo", "original nintendo", "nintendo classic"],
    "playstation": ["ps", "playstation", "ps1", "playstation 1", "sony playstation"],
    "playstation-2": ["ps2", "playstation 2", "playstation2", "sony ps2", "ps 2"],
    "playstation-3": ["ps3", "playstation 3", "playstation3", "sony ps3", "ps 3"],
    "sega-master-system": ["sega master system", "master system", "sega ms", "sms", "sega master"],
    "sega-genesis": ["sega genesis", "genesis", "sega mega drive", "mega drive", "sega md"],
    "sega-32x": ["sega 32x", "32x", "mega 32x", "genesis 32x", "sega thirty-two x"],
    "sega-saturn": ["sega saturn", "saturn", "ss", "sega ss", "saturn console"],
    "sega-dreamcast": ["sega dreamcast", "dreamcast", "dc", "sega dc", "dream cast"],
    "sega-game-gear": ["sega game gear", "game gear", "sega gg", "gg", "sega portable"],
    "xbox": ["xbox", "original xbox", "xbox original", "microsoft xbox", "xbox 1"],
    "xbox-360": ["xbox 360", "x360", "360", "xbox360", "microsoft 360"],
    "xbox-one": ["xbox one", "xbone", "xbox1", "xboxone", "xbox 1"],
    "atari-2600": ["atari 2600", "2600", "atari2600", "atari vcs", "vcs"],
    "atari-5200": ["atari 5200", "5200", "atari5200", "atari super system", "super system"]

    };


    function analyzeQuery(query) {
        // Convert query to lowercase and split into words
        const words = query.toLowerCase().split(/\s+/);
    
        // Object to hold the consoles to check off
        const consolesToCheck = {};
    
        // Iterate over each word in the query
        words.forEach(word => {
            // Check each console's keywords for a match
            for (const [console, keywords] of Object.entries(consoleKeywords)) {
                keywords.forEach(keyword => {
                    // Special case for "nes" to avoid false positives like "genesis"
                    if (keyword === "nes" && word !== "nes" && word.includes("nes")) {
                        return; // Skip to the next keyword
                    }
                    const pattern = new RegExp('\\b' + keyword + '\\b', 'gi');
                    if (pattern.test(word)) {
                        consolesToCheck[console] = true;
                    }
                });
            }
        });
    
        return Object.keys(consolesToCheck).length > 0 ? consolesToCheck : { 'all': true };
    }
    

///////////////////////////////////////////////////////////////////////////////

// This is the function that runs when the ads load, it adds them to local storage // doesn't accumulate ads

document.addEventListener('adsUpdated', function(event) {
    console.log("Ads have been updated. Number of ads received:", event.detail.length);

    // Initialize an array to hold the ad data for localStorage
    let adsData = [];

    event.detail.forEach((ad, index) => {
        // Log detailed information for each ad, ensuring all properties are accounted for
        // console.log(`Ad ${index + 1}: Title: ${ad.title}, Description: ${ad.description}`);
        // console.log(`Date Posted: ${ad.date}, URL: ${ad.url}`);
        // console.log(`Primary Image: ${ad.image}`);
        // console.log(`Additional Images: ${ad.images.join(', ')}`);
        // console.log(`Attributes: ${JSON.stringify(ad.attributes)}`);
        // console.log(`Ad ID: ${ad.id}`);

        // Store ad data in an array
        adsData.push({
            title: ad.title,
            description: ad.description,
            date: ad.date, // Assuming the date is already a proper Date object or formatted string
            image: ad.image,
            images: ad.images,
            attributes: ad.attributes,
            url: ad.url,
            id: ad.id
        });
    });

    // Convert the array of ads data to a JSON string and store it in localStorage
    localStorage.setItem('adsData', JSON.stringify(adsData));

    // Optionally, log that the data has been saved to localStorage
    console.log("Ads data has been saved to localStorage.");
});


// This is the function that runs when the query button is clicked - > it 

document.addEventListener('requestPriceChart', function(event) {
    // Retrieve the ad title from the event's details
    const { adTitle } = event.detail;

    // Find the input element by its ID and update its value to the ad title
    const gameTitleInput = document.getElementById('gameTitle');
    if (gameTitleInput) {
        gameTitleInput.value = adTitle;
    }

    // Call the submitQuery function to perform the search with the updated title
    submitQuery(); // Ensure this function handles the form submission appropriately
});


/////////////////////////////////////////////////////////////////////////////////////////

// This function handles the checkbox updated an then calls submitQueryWithCurrentSelection to perform the search with the new selection

function handleConsoleCheckboxChange() {
    // If a specific console is checked, uncheck the 'All Consoles' checkbox
    if (this.id !== 'allConsoles' && this.checked) {
        document.getElementById('allConsoles').checked = false;
    } else if (this.id === 'allConsoles' && this.checked) {
        // If 'All Consoles' is checked, uncheck all other consoles
        document.querySelectorAll('input[name="console"]').forEach(checkbox => {
            if (checkbox.id !== 'allConsoles') {
                checkbox.checked = false;
            }
        });
    }
    // Call submitQueryWithCurrentSelection to perform the search with the new selection
    submitQueryWithCurrentSelection();
}



// function submitQueryWithCurrentSelection() {
//     var title = document.getElementById('gameTitle').value;
//     var allConsolesCheckbox = document.getElementById('allConsoles');
    
//     // Determine the consoles string for the fetch request based on currently selected checkboxes
//     var consolesString = allConsolesCheckbox.checked ? 'all' : Array.from(document.querySelectorAll('input[name="console"]:checked')).map(console => console.value).join(',');
    
//     fetch(`/api/search-games?title=${encodeURIComponent(title)}&consoles=${encodeURIComponent(consolesString)}`)
//         .then(response => response.json())
//         .then(data => {
//             displayResults(data);
//         })
//         .catch(error => {
//             console.log('Error:', error);
//         });
// }



const bannedWords = [`loose`, `cib`, `complete in box`, `for`, `game`, `reduced`, `vintage`, `complete`, `retro`, `in box`];

function sanitizeTitle(title) {
    // Normalize the title by converting diacritical marks to ASCII equivalents
    title = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convert to lower case and trim whitespace
    title = title.toLowerCase().trim();

    // Remove contents within parentheses along with the parentheses themselves
    title = title.replace(/\(.*?\)/g, '').trim();

    // Replace known console names and keywords found in the title
    for (const [console, keywords] of Object.entries(consoleKeywords)) {
        keywords.forEach(keyword => {
            const pattern = new RegExp('\\b' + keyword + '\\b\\s*', 'gi');
            title = title.replace(pattern, '');
        });
    }

    // Remove banned words and phrases located anywhere in the title
    bannedWords.forEach(word => {
        const wordPattern = new RegExp('\\b' + word + '\\b', 'gi');
        title = title.replace(wordPattern, '').trim();
    });

    // Cleanup to ensure no additional spaces are left after removing banned words or phrases
    title = title.replace(/\s\s+/g, ' ').trim();

    // Remove any non-alphanumeric characters (except spaces and hyphens)
    title = title.replace(/[^a-z0-9 -]/gi, '').trim();

    // Ensure the first character is a letter, remove all leading non-letters
    while (title.length > 0 && !/^[a-z]/i.test(title.charAt(0))) {
        title = title.substring(1);
    }

    return title;
}




function submitQueryWithCurrentSelection() {
    let title = document.getElementById('gameTitle').value;
    let allConsolesCheckbox = document.getElementById('allConsoles');

    // Sanitize the title before using it in the API request
    let sanitizedTitle = sanitizeTitle(title);

    // Determine the consoles string for the fetch request based on currently selected checkboxes
    let consolesString = allConsolesCheckbox.checked ? 'all' : Array.from(document.querySelectorAll('input[name="console"]:checked')).map(console => console.value).join(',');

    // Log the query parameters to the console before sending them
    console.log(`Sending API request with title: '${sanitizedTitle}' and consoles: '${consolesString}'`);

    // Function to fetch data and update results
    function fetchDataAndUpdateResults(query, passNumber = 1, index = 0) {
        if (query.length <= 3) {
            console.log("Query too short, no results found.");
            displayResults([]); // Display no results message
            return;
        }

        let queryURL = `/api/search-games?title=${encodeURIComponent(query)}&consoles=${encodeURIComponent(consolesString)}`;
        console.log("Query URL:", queryURL);  // Log the full query URL

        fetch(queryURL)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0 && query.length > 3) {
                    console.log("No results found, adjusting query...");
                    // If no results found, adjust the query by removing one character
                    if (passNumber === 1) {
                        fetchDataAndUpdateResults(query.substring(1), 1); // Trim from the start
                    } else if (passNumber === 2) {
                        fetchDataAndUpdateResults(query.slice(0, -1), 2); // Trim from the end
                    } else {
                        // Third pass: alternate trimming from the start and end based on index
                        let newQuery = (index % 2 === 0) ? query.substring(1) : query.slice(0, -1);
                        fetchDataAndUpdateResults(newQuery, 3, index + 1);
                    }
                } else if (data.length === 0 && query.length === 3) {
                    // If no results found and query is exactly 3 characters long, change direction of trimming
                    if (passNumber === 1) {
                        fetchDataAndUpdateResults(sanitizedTitle, 2);  // Start trimming from the end
                    } else if (passNumber === 2) {
                        fetchDataAndUpdateResults(sanitizedTitle, 3, 0);  // Start the third pass
                    } else {
                        displayResults([]);  // Display no results message
                    }
                } else {
                    displayResults(data);  // Display found results
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }

    // Initial fetch with sanitized title, starting by trimming from the start
    fetchDataAndUpdateResults(sanitizedTitle, 1);
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results
    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';  // Display no results message
    } else {
        data.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.innerHTML = `<h4>Title: ${game.game_title}</h4><p>Console: ${game.game_console}</p><p>Loose Value: $${game.loose_val}</p><p>Complete Value: $${game.complete_val}</p><p>New Value: $${game.new_val}</p><p>Pull Date: ${game.pull_date}</p><a href="${game.Link}" target="_blank">More Info</a>`;
            resultsDiv.appendChild(gameDiv);
        });
    }
}




function submitQuery() {
    var title = document.getElementById('gameTitle').value;
    
    // First, uncheck all the consoles
    document.querySelectorAll('input[name="console"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Analyze the title to determine which consoles should be checked
    var consolesToCheck = analyzeQuery(title);
    
    var allConsolesCheckbox = document.getElementById('allConsoles');
    
    // If no specific consoles are detected, check the 'All Consoles' box
    if (consolesToCheck['all']) {
        allConsolesCheckbox.checked = true;
    } else {
        allConsolesCheckbox.checked = false;
        document.querySelectorAll('input[name="console"]').forEach(checkbox => {
            checkbox.checked = !!consolesToCheck[checkbox.value];
        });
    }

    // Call submitQueryWithCurrentSelection to perform the search
    submitQueryWithCurrentSelection();
}

// function displayResults(data) {
//     var resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';
//     data.forEach(game => {
//         var gameDiv = document.createElement('div');
//         gameDiv.innerHTML = `Title: ${game.game_title}, Console: ${game.game_console}, Loose Value: $${game.loose_val}, Complete Value: $${game.complete_val}, New Value: $${game.new_val}, Pull Date: ${game.pull_date}, <a href="${game.Link}">More Info</a>`;
//         resultsDiv.appendChild(gameDiv);
//     });
// }

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    // Clear previous results
    resultsDiv.innerHTML = '';

    // Loop through each game and create elements to display its data
    data.forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.classList.add('game-info'); // Added class for potential CSS styling

        // Correctly format the URL by appending the game link to the base URL
        let fullURL = `https://www.pricecharting.com${game.Link}`;

        // Create an inner HTML structure with detailed game information
        gameDiv.innerHTML = `
            <h4>Title: ${game.game_title}</h4>
            <p>Console: ${game.game_console}</p>
            <p>Loose Value: $${game.loose_val}</p>
            <p>Complete Value: $${game.complete_val}</p>
            <p>New Value: $${game.new_val}</p>
            <p>Pull Date: ${game.pull_date}</p>
            <a href="${fullURL}" target="_blank">More Info</a>
        `;

        // Append the newly created game information div to the results container
        resultsDiv.appendChild(gameDiv);
    });

    // Check if no results found and handle accordingly
    if (data.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}



document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name="console"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleConsoleCheckboxChange);
    });
  //  submitQuery();
});