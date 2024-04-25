document.addEventListener('DOMContentLoaded', function() {

    // Function to update the list of ads on the webpage
    function updateAdList(ads) {
        const adList = document.getElementById('ad-results');
        adList.innerHTML = '';  // Clear the existing list of ads

        ads.forEach((ad, index) => {
            const adElement = document.createElement('li');  // Create a new list item for each ad
            adElement.classList.add('list-group-item');
            adElement.style.display = 'flex';
            adElement.style.justifyContent = 'space-between';
            adElement.style.alignItems = 'center';

            // Create a div to display the title and price of the ad
            const titlePriceDiv = document.createElement('div');
            titlePriceDiv.style.flexGrow = 1;

            // Create a link element for the ad title
            const adTitle = document.createElement('a');
            adTitle.href = ad.url;
            adTitle.setAttribute('target', '_blank');
            adTitle.innerHTML = `${ad.title} - $${ad.attributes.price}`;

            titlePriceDiv.appendChild(adTitle);  // Add the title link to the div
            adElement.appendChild(titlePriceDiv);  // Add the div to the list item

            // Add additional features as a new div
            const featureDiv = document.createElement('div');
            featureDiv.textContent = 'NEW FEATURE';
            featureDiv.classList.add('feature-class');
            featureDiv.style.marginLeft = '10px';

            // Create a button for querying price charts
            const priceChartButton = document.createElement('button');
            priceChartButton.textContent = 'Query';
            priceChartButton.classList.add('btn', 'btn-primary', 'pricechart-class');
            priceChartButton.style.marginLeft = '10px';

            // Event listener for the button to dispatch a custom event with ad details
            priceChartButton.addEventListener('click', function() {
                document.dispatchEvent(new CustomEvent('requestPriceChart', { detail: { adTitle: ad.title, index: index } }));
            });

            adElement.appendChild(featureDiv);  // Add the feature div to the list item
            adElement.appendChild(priceChartButton);  // Add the price chart button

            // Add collapsible details about the ad
            const adDetails = document.createElement('div');
            adDetails.id = `adDetails${index}`;
            adDetails.classList.add('collapse');
            adDetails.innerHTML = `<p>Price: $${ad.attributes.price}</p><p>${ad.description}</p>`;

            adElement.appendChild(adDetails);  // Add details to the list item
            adList.appendChild(adElement);  // Add the list item to the main list
        });

        // Dispatch an event after updating the ad list
        document.dispatchEvent(new CustomEvent('adsUpdated', { detail: ads }));
    }

    // Function to fetch ads based on selected location and query
    function fetchAdsForLocationAndQuery(locationId, query) {
        fetch(`http://localhost:3000/search-ads?locationId=${locationId}&q=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(ads => {
                updateAdList(ads);  // Update ad list based on new selection
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }

    // Attach event listeners to radio buttons for location and query selection
    document.querySelectorAll('input[name="location"]').forEach(radio => {
        radio.addEventListener('change', updateAdsBasedOnSelection);
    });

    document.querySelectorAll('input[name="query"]').forEach(radio => {
        radio.addEventListener('change', updateAdsBasedOnSelection);
    });

    // Function to update ads based on the current selection of location and query
    function updateAdsBasedOnSelection() {
        const selectedLocation = document.querySelector('input[name="location"]:checked').value;
        const selectedQuery = document.querySelector('input[name="query"]:checked').value;
        fetchAdsForLocationAndQuery(selectedLocation, selectedQuery);  // Fetch ads with new criteria
    }

    // Initial fetch of ads based on the default selected location and query on page load
    updateAdsBasedOnSelection();
});