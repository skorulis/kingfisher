var map;
var marker;
var currentIndex;
var diff;
var totalTime;
var lastTime;
var currentTime;
var dirLat;
var dirLng;

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
	var nextItem = data.data[currentIndex-1];
	var firstItem = data.data[0];
	
	var lat = item.place.location.latitude;
	var lng = item.place.location.longitude;
	var lat2 = nextItem.place.location.latitude;
	var lng2 = nextItem.place.location.longitude;
	
	var position = new google.maps.LatLng(lat,lng);
	var title = item.place.name;
	var image = "img/plane.png"
	marker = new google.maps.Marker({map:map,position:position,draggable:false,title:title,icon:image});
	var t1 = new Date(item.created_time);
	var t2 = new Date(firstItem.created_time);
	
	var dist = distance(lat,lng,lat2,lng2);
	dirLat = (lat2 - lat)/10;
	dirLng = (lng2 - lng)/10;
	
	totalTime = t2.getTime()-t1.getTime();
	console.log(totalTime);
	console.log(dist);
	setInterval(updateLocation,24);
}

function updateLocation() {
	currentTime = + new Date();
	var delta = currentTime - lastTime;
	lastTime = currentTime;
	if(isNaN(delta)) {
		return;
	}
	var position = marker.getPosition();
	
	var lat = position.lat();
	var lng = position.lng();
	
	var latDiff = latNext - lat;
	var lngDiff = lngNext - lng;
	lat+=(dirLat*delta)/1000.0;
	lng+=(dirLng*delta)/1000.0;
	
	console.log(delta);
	
	position = new google.maps.LatLng(lat,lng);
	marker.setPosition(position);
}

function distance(lat1,lng1,lat2,lng2) {
	return Math.sqrt((lat1-lat2)*(lat1-lat2) + (lng1-lng2)*(lng1-lng2));
}
