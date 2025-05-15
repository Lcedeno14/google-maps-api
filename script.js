// Game state variables (global scope)
let currentLocationIndex = 0;
let score = 0;
let circles = [];  // Changed from rectangles to circles
let map;
let targetLocations = [
  {//my assigned location 
    name: "The Soraya",
    lat: 34.23599732969022,
    lng: -118.5285702234408
  },
  {
    name: "Cypress Hall",
    lat: 34.23644825737171,
    lng: -118.5295660351223
  },
  {
    name: "CSUN Campus Store",
    lat: 34.23736458742686, 
    lng: -118.5281978144329
  },
  {
    name: "CSUN Library",
    lat: 34.239951584657874, 
    lng: -118.52926416283476
  },
  {
    name: "Arbor Grill",
    lat: 34.24120695567284, 
    lng: -118.5296588142717 
  }
];

// Function to show the next location to find
function showNextLocation() {
  if (currentLocationIndex < targetLocations.length) {
    const location = targetLocations[currentLocationIndex];
    document.getElementById("current-location").innerHTML = 
      `<b>Find:</b> ${location.name}`;
    document.getElementById("score").innerHTML = `Score: ${score}`;
  } else {
    document.getElementById("current-location").innerHTML = 
      `<b>Game Over!</b> Final Score: ${score}/${targetLocations.length}`;
  }
}

// Function to handle a guess
function handleGuess(clickedLat, clickedLng) {
  if (currentLocationIndex >= targetLocations.length) return;

  const target = targetLocations[currentLocationIndex];
  
  // Calculate distance between clicked point and target
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(clickedLat, clickedLng),
    new google.maps.LatLng(target.lat, target.lng)
  );
  
  // Consider it correct if within 50 meters
  const isCorrect = distance <= 50;

  // Create circle at clicked location
  const circle = new google.maps.Circle({
    strokeColor: isCorrect ? "limegreen" : "red",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: isCorrect ? "limegreen" : "red",
    fillOpacity: 0.35,
    map: map,
    center: { lat: clickedLat, lng: clickedLng },
    radius: 25, // 25 meters radius
    clickable: false
  });

  circles.push(circle);

  // Shake the map wrapper if the guess is wrong
  if (!isCorrect) {
    const mapWrapper = document.getElementById('map-wrapper');
    mapWrapper.classList.add('shake');
    setTimeout(() => {
      mapWrapper.classList.remove('shake');
    }, 500);
  }

  // Update score if correct
  if (isCorrect) {
    score++;
  }

  // Move to next location
  currentLocationIndex++;
  showNextLocation();
}

// Initialize the map
function initMap() {
  // Create a map centered at a specific location
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.238521602831376, lng: -118.52929227268223 },
    zoom: 16.7,
    disableDefaultUI: true,
    gestureHandling: "none",
    clickableIcons: false,
    // Add styles to hide all text and labels
    styles: [
      {
        // Hide all labels
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      },
      {
        // Hide all text
        featureType: "all",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }]
      },
      {
        // Hide all icons
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
      },
      {
        // Hide points of interest
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  // Add double-click event listener to the map
  map.addListener("dblclick", (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    handleGuess(clickedLat, clickedLng);
  });

  // Start the game
  showNextLocation();
}

// Reset game function
function resetGame() {
  // Clear all circles from the map
  circles.forEach(circle => {
    circle.setMap(null);
  });
  circles = [];
  
  // Reset game state
  score = 0;
  currentLocationIndex = 0;
  
  // Update display
  showNextLocation();
}

// Call initMap when the page loads
window.onload = initMap;
