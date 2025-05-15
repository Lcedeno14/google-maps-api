// Game state variables (global scope)
let currentLocationIndex = 0;
let score = 0;
let rectangles = [];
let map;
let targetLocations = [
  {
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
    name: "Jacaranda Hall",
    lat: 34.24127063498234,  
    lng: -118.5288082943056
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
  
  // Check if the click is within range of the target
  const isCorrect = 
    clickedLat <= target.lat + 0.0007 &&
    clickedLat >= target.lat - 0.0007 &&
    clickedLng >= target.lng - 0.0007 &&
    clickedLng <= target.lng + 0.0007;

  // Create rectangle at clicked location
  const bounds = {
    north: clickedLat + 0.0005,
    south: clickedLat - 0.0005,
    east: clickedLng + 0.0005,
    west: clickedLng - 0.0005
  };

  const rectangle = new google.maps.Rectangle({
    strokeColor: isCorrect ? "limegreen" : "red",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: isCorrect ? "limegreen" : "red",
    fillOpacity: 0.35,
    map: map,
    bounds: bounds,
    clickable: false
  });

  rectangles.push(rectangle);

  // Shake the map wrapper if the guess is wrong
  if (!isCorrect) {
    const mapWrapper = document.getElementById('map-wrapper');
    mapWrapper.classList.add('shake');
    // Remove the shake class after animation completes
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
  // Clear all rectangles from the map
  rectangles.forEach(rectangle => {
    rectangle.setMap(null);
  });
  rectangles = [];
  
  // Reset game state
  score = 0;
  currentLocationIndex = 0;
  
  // Update display
  showNextLocation();
}

// Call initMap when the page loads
window.onload = initMap;
