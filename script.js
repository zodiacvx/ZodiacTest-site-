let map;
let addTreeMode = false;
let addZoneMode = false;
let tempMarker = null;
let markers = [];
let user = null;
let zonePoints = [];
let tempPolygon = null;

function showRegister() {
  document.getElementById('register-form').style.display = 'flex';
  document.getElementById('login-form').style.display = 'none';
}

function showLogin() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'flex';
}

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19,
    attribution: ' OpenStreetMap contributors'
  }).addTo(map);

  map.on('click', onMapClick);
}

function onMapClick(e) {
  if (addTreeMode) {
    if (tempMarker) {
      map.removeLayer(tempMarker);
    }
    tempMarker = L.marker(e.latlng).addTo(map);
    document.getElementById('tree-details').style.display = 'flex';
    document.getElementById('zone-details').style.display = 'none';
  } else if (addZoneMode) {
      zonePoints.push(e.latlng);
      if(tempPolygon){
          map.removeLayer(tempPolygon)
      }
      tempPolygon = L.polygon(zonePoints, {color: 'green'}).addTo(map);
      document.getElementById('zone-details').style.display = 'flex';
      document.getElementById('tree-details').style.display = 'none';
  }
}

function toggleAddTreeMode() {
    addTreeMode = !addTreeMode;
    addZoneMode = false;
    if (addTreeMode){
        document.getElementById("add-tree-button").innerText = "Adding Trees...";
        document.getElementById("add-zone-button").innerText = "Add Zone";

    } else {
        document.getElementById("add-tree-button").innerText = "Add Tree";
        document.getElementById('tree-details').style.display = 'none';
         if (tempMarker) {
            map.removeLayer(tempMarker);
            tempMarker = null;
        }
    }
    if(tempPolygon){
        map.removeLayer(tempPolygon)
        tempPolygon = null;
        zonePoints = [];
    }
        document.getElementById('zone-details').style.display = 'none';
}

function toggleAddZoneMode() {
    addZoneMode = !addZoneMode;
    addTreeMode = false;
    if(addZoneMode){
      document.getElementById("add-zone-button").innerText = "Adding Zone..."
      document.getElementById("add-tree-button").innerText = "Add Tree";
    } else {
        document.getElementById("add-zone-button").innerText = "Add Zone";
        document.getElementById('zone-details').style.display = 'none';
    if(tempPolygon){
          map.removeLayer(tempPolygon)
          tempPolygon = null;
      }
        zonePoints = [];
    }

     if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
    document.getElementById('tree-details').style.display = 'none';
}

function saveTree() {
    const treeName = document.getElementById('tree-name').value;
    if(treeName && tempMarker){
      const newMarker = L.marker(tempMarker.getLatLng()).addTo(map);
      newMarker.bindPopup(`<b>${treeName}</b>`);
       newMarker.on('contextmenu', function(e){
        map.removeLayer(e.target)
           markers = markers.filter(m => m.marker !== e.target);
      });
      markers.push({name: treeName, marker: newMarker});


      map.removeLayer(tempMarker);
      tempMarker = null;
      document.getElementById('tree-name').value = '';
      document.getElementById('tree-details').style.display = 'none';
      addTreeMode = false;
        document.getElementById("add-tree-button").innerText = "Add Tree";

    } else {
        alert("Please enter a name and click the map to place a marker")
    }
}

function cancelAddTree(){
    if(tempMarker){
        map.removeLayer(tempMarker)
        tempMarker = null
    }
    document.getElementById('tree-details').style.display = 'none';
    addTreeMode = false;
    document.getElementById("add-tree-button").innerText = "Add Tree";
}
function saveZone() {
  const zoneName = document.getElementById('zone-name').value;
    if(zoneName && zonePoints.length > 2){
        const newPolygon = L.polygon(zonePoints, {color: 'green'}).addTo(map);
      newPolygon.bindPopup(`<b>${zoneName}</b>`);
      markers.push({name: zoneName, marker: newPolygon});

        map.removeLayer(tempPolygon);
      tempPolygon = null;
      zonePoints = [];
      document.getElementById('zone-name').value = '';
      document.getElementById('zone-details').style.display = 'none'
        addZoneMode = false;
        document.getElementById("add-zone-button").innerText = "Add Zone";

    } else {
      alert("Please enter a name and make sure the zone has at least 3 points")
    }
}

function cancelAddZone() {
    if(tempPolygon){
        map.removeLayer(tempPolygon)
        tempPolygon = null;
    }
  zonePoints = [];
    document.getElementById('zone-details').style.display = 'none';
    addZoneMode = false;
    document.getElementById("add-zone-button").innerText = "Add Zone";
}

function search() {
  const query = document.getElementById('search-input').value.toLowerCase();
    if (!query) { return }
  const results = markers.filter(item => item.name.toLowerCase().includes(query));
  if (results.length > 0) {
      if(results[0].marker instanceof L.Marker){
        map.flyTo(results[0].marker.getLatLng(), 15);
      }
      results[0].marker.openPopup()
  } else {
    alert("No matching trees/sectors found")
  }
}

document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  localStorage.setItem(username, password); 
  alert('Registration successful! You can now log in.');
  showLogin();
});

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

    if (localStorage.getItem(username) == password){
        user = username;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('map-container').style.display = 'block';
        initMap();
    } else {
        alert("Invalid username or password")
    }
});

showRegister();