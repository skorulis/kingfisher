var map;
var marker;
var currentIndex;
var diff;

function initialize() {
    var latlng = new google.maps.LatLng(51.50788400951119,-0.1368303833007758);
    var myOptions = {
      zoom: 2,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	loadLocations();
}

function loadLocations() {
	currentIndex = data.data.length-1;
	var item = data.data[currentIndex];
	var lat = item.place.location.latitude;
	var lng = item.place.location.longitude;
	var position = new google.maps.LatLng(lat,lng);
	var title = item.place.name;
	var image = "img/plane.png"
	marker = new google.maps.Marker({map:map,position:position,draggable:false,title:title,icon:image});
	
	setInterval(updateLocation,24);
}

function updateLocation() {
	var nextItem = data.data[currentIndex-1];
	var position = marker.getPosition();
	var latNext = nextItem.place.location.latitude;
	var lngNext = nextItem.place.location.longitude;
	
	var lat = position.lat();
	var lng = position.lng();
	
	var latDiff = latNext - lat;
	var lngDiff = lngNext - lng;
	
	
	position = new google.maps.LatLng(lat,lng);
	marker.setPosition(position);
}

