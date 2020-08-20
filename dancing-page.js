let latitude;
let longitude;
let pos;
let map;
let infoWindow;
let currentWindow;
let bounds;
let service;
let photoElement;
const nameElement = document.querySelector(".dancing-name");
const ratingElement = document.querySelector(".rating");
const priceLevelElement = document.querySelector(".price-level");
const addressElement = document.querySelector(".address");
const isOpenElement = document.querySelector(".open");
const websiteElement = document.querySelector(".website");

function initMap() {
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;
    bounds = new google.maps.LatLngBounds();
    photoElement = document.getElementById('dancing-photo');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            pos = {
                lat: latitude,
                lng: longitude
            };
            map = new google.maps.Map(document.getElementById("map"), {
                center: pos,
                zoom: 15
            });
            bounds.extend(pos);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found!');
            infoWindow.open(map);
            map.setCenter(pos);
            getDancing(pos);
        }, () => {
            // if user denied permission
            handleError(infoWindow);
        });
    } else {
        // if browser doesn't support geolocation
        handleError(infoWindow);
    }
}

function handleError(infoWindow) {
    // Set default location to Boston, MA
    pos = {
        lat: 42.3601,
        lng: -71.0589
    };
    map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 15
    });

    infoWindow.setPosition(pos);
    infoWindow.setContent('Cannot find location. Using default location');
    infoWindow.open(map);
    currentInfoWindow = infoWindow;

    getDancing(pos);
}

function getDancing(position) {
    let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: 'dancing'
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, nearbyCallback);
}

// Handle the results (up to 20) of the Nearby Search
function nearbyCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
    }
}

function createMarkers(places) {
    places.forEach(place => {
        let marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
        });

        google.maps.event.addListener(marker, 'click', () => {
            let request = {
                placeId: place.place_id,
                fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos', 'opening_hours', 'price_level']
            };

            // will only show details for the marker that is selected
            service.getDetails(request, (placeResult, status) => {
                showMarkerInfo(placeResult, marker, status)
            });
        });

        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
    });
    // make sure all markers are displayed
    map.fitBounds(bounds);
}

function showMarkerInfo(placeResult, marker, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        placeInfowindow.setContent(`<div><strong>${placeResult.name}</strong></div>`);
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showDancingInfo(placeResult);
    } 
}

function showDancingInfo(placeResult) {
    // first clear the previous img
    while (photoElement.lastChild) {
        photoElement.removeChild(photoElement.lastChild);
    }

    // now clear everything else
    nameElement.innerHTML = "<div></div>";
    ratingElement.innerHTML = "<div></div>";
    priceLevelElement.innerHTML = "<div></div>";
    addressElement.innerHTML = "<div></div>";
    isOpenElement.innerHTML = "<div></div>";
    websiteElement.innerHTML = "<div></div>"; 

    if (placeResult.photos) {
        restuarantPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('dancing-img');
        photo.src = restuarantPhoto.getUrl();
        photoElement.appendChild(photo);
    }

    if (placeResult.name) {
        nameElement.innerHTML = `<h2 class="pt-2">${placeResult.name}</h2>`;
    }
    if (placeResult.rating) {
        ratingElement.innerHTML = `<h6>Rating: ${placeResult.rating} <img src=${getRating(placeResult.rating)} class="rating-img"></h6>`;
    }
    if (placeResult.price_level) {
        priceLevelElement.innerHTML = `<h6>Price level: ${getPriceLevel(placeResult.price_level)}</h6>`;
    }
    if (placeResult.formatted_address) {
        addressElement.innerHTML = `<h6>${placeResult.formatted_address}</h6>`;
    }
    if (placeResult.opening_hours != null) {
        isOpenElement.innerHTML = `<h6>${isHikingOpen(placeResult.opening_hours)}</h6>`;
    }
    if (placeResult.website) {
        websiteElement.innerHTML = `<h6>Visit ${placeResult.name}'s website <a href=${placeResult.website} target="_blank">here.</a></h6>`
    }

}

function getPriceLevel(priceLevel) {
    switch(priceLevel) {
        case 1:
            return '$';
        case 2:
            return '$$';
        case 3:
            return '$$$';
        case 4:
            return '$$$$';
        case 5:
            return '$$$$$';
    }
}

function isHikingOpen(isOpen) {
    return (isOpen ? 'Open now' : 'Closed');
}

function getRating(rating) {
    if (rating < 1.5) {
        return 'imgs/1-star-rating.jpg';
    }
    else if (rating < 2.5) {
        return 'imgs/2-star-rating.jpg';
    }
    else if (rating < 3.5) {
        return 'imgs/3-star-rating.jpg';
    }
    else if (rating < 4.5) {
        return 'imgs/4-star-rating.jpg';
    }
    else if (rating >= 4.5) {
        return 'imgs/5-star-rating.jpg';
    }
    else {
        return '';
    }
}
