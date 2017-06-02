
var map, places;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var loggedIn = false;

var countries = {
  'us': {
    center: {lat: 37.1, lng: -95.7},
    zoom: 3
  }
};

$.getJSON('/api/user', function(data){
  if(data.id){
    loggedIn = true;
    console.log(data);
  }
});

function getVisitors(e, placeId){
  $.ajaxSetup({ cache: false});
  $.getJSON('/api/visits/' + placeId, function(data){
    e.parentNode.children[3].innerHTML = data;
  });
}

function updateVisit(e, visitStatus){

  console.log('3. visitStatus: ' + visitStatus);

  var data = e.getAttribute('value')

  console.log(e);

  if(visitStatus == 1){
    console.log('4. Updating Visit Status to Zero')
    $(e).removeClass('btn-success');
    $(e).addClass('btn-primary');
    e.innerHTML = 'Visit';
    updateVisitStatus(e,0);
  }

  else if(visitStatus == 0){
    console.log('4. Updating Visit Status to One')
    $(e).removeClass('btn-primary');
    $(e).addClass('btn-success');
    e.innerHTML = Visiting;
    updateVisitStatus(e,1);
  }

  else {
    console.log('4. Adding new Visit')
    $.ajax({
      type: "POST",
      cache: false,
      url: '/addVisit',
      data: {
          bar_id: data
      },
      success: getVisitors(e, data)
    });
  }

}

function getVisitStatus(e){
  var barId = e.getAttribute('value');
  var visitStatus;

  $.getJSON(
    '/api/user/' + barId + '/visitStatus',
    function(data){
      console.log(data);
      if(data.length > 0){
        visitStatus = data[0].going;
      }
      else{
        visitStatus = 2;
      }

      console.log('2. visitStatus: ' + visitStatus);
      updateVisit(e, visitStatus);
    });
  };

function updateVisitStatus(e,status){
 var barId = e.getAttribute('value');
 $.ajax({
   type: 'POST',
   cache: false,
   url: '/api/user/' + barId + '/visitStatus/' + status
 });
}



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  map.addListener('dragend',onDrag);

  autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')));
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

}


function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(13);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
  }
}

function onDrag(){
  if(map.getZoom() >= 11){
    search();
  }
}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['bar']
  };

  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearCards();
      clearMarkers();
      // Create a marker for each hotel found, and
      // assign a letter of the alphabetic to each marker icon.
      for (var i = 0; i < 10; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        // Use marker animation to drop the icons incrementally on the map.
        markers[i] = new google.maps.Marker({
          position: results[i].geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
        // If the user clicks a hotel marker, show the details of that hotel
        // in an info window.
        markers[i].placeResult = results[i];
        setTimeout(dropMarker(i), i * 100);
        addCard(results[i], i);
      }
    }
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function addCard(result, i) {
  var results = document.getElementById('cards');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var div0 = document.createElement('div');
  var div = document.createElement('div');
  var h4 = document.createElement('h4');
  var h6 = document.createElement('h6');
  var p = document.createElement('p');
  var icon = document.createElement('img');
  var name = document.createTextNode(result.name);
  var a = document.createElement('a');
  var sp = document.createElement('span');

  div0.className = 'card';
  div.className = 'card-block';
  h4.className = 'card-title';
  h6.className = 'card-subtitle mb-2 text-muted';
  p.className = 'card-text';

  a.className = 'btn btn-primary';
  a.innerHTML = 'Visit';

  if(loggedIn){
    a.setAttribute('onclick', 'getVisitStatus(this)');
  }
  else {
    a.setAttribute('href', '/auth/facebook');
  }

  a.setAttribute('value', result.place_id);

  console.log('data: ' + result.place_id);

  h4.appendChild(name);

  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  icon.setAttribute('display', 'inline-block;');

  div.appendChild(icon);
  div.appendChild(h4);
  div.appendChild(h6);
  div.appendChild(sp);
  div.appendChild(a);
  div0.appendChild(div);
  results.appendChild(div0);

  getVisitors(sp, result.place_id);
}

function clearCards() {
  var results = document.getElementById('cards');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}
