var timeToPoint;

var map;
var marker;
var currentIndex;
var diff;
var totalTime;
var lastTime;
var currentTime;
var lastDiff;
var dirLat;
var dirLng;
var allItems = new Array();

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

function takeRelevantData(items) {
	var pos;
	for(var i=0; i < items.length; ++i) {
		var item = items[i];
		pos = new Object();
		pos.lat = item.place.location.latitude;
		pos.lng = item.place.location.longitude;
		pos.name = item.place.name;
		pos.created = item.created_time;
		allItems.push(pos);
	}
}

function loadLocations() {
	var pos;
	takeRelevantData(data.data);

	currentIndex = allItems.length-1;
	pos = allItems[currentIndex];
	var pos2 = allItems[currentIndex-1];
	console.log("CI " + currentIndex);
	console.log("2 " + pos2);
	var firstPos = allItems[0];
	
	
	var position = new google.maps.LatLng(pos.lat,pos.lng);
	var image = "img/plane.png";
	marker = new google.maps.Marker({map:map,position:position,draggable:false,title:pos.name,icon:image});
	var t1 = new Date(pos.created);
	var t2 = new Date(firstPos.created);
	totalTime = t2.getTime()-t1.getTime();
	console.log(totalTime);
	
	
	setupMovement(pos,pos2);
	
	
	setInterval(updateLocation,24);
}

function setupMovement(pos,pos2) {
	timeToPoint = 2000;
	console.log(pos);
	var dist = distance(pos.lat,pos.lng,pos2.lat,pos2.lng);
	
	dirLat = (pos2.lat - pos.lat)/timeToPoint;
	dirLng = (pos2.lng - pos.lng)/timeToPoint;
	
	
	console.log(dist);
}

function updateLocation() {
	currentTime = + new Date();
	var delta = currentTime - lastTime;
	lastTime = currentTime;
	if(isNaN(delta)) {
		return;
	}
	timeToPoint-=delta;
	var position = marker.getPosition();
	
	var lat = position.lat();
	var lng = position.lng();
	
	lat+=(dirLat*delta);
	lng+=(dirLng*delta);
	
	
	position = new google.maps.LatLng(lat,lng);
	
	marker.setPosition(position);
	if(timeToPoint <= 0) {
		if(currentIndex > 1) {
			var pos = allItems[currentIndex];
			var pos2 = allItems[currentIndex-1];
			setupMovement(pos,pos2);
			currentIndex--;
		}
		
	}
}

function distance(lat1,lng1,lat2,lng2) {
	return Math.sqrt((lat1-lat2)*(lat1-lat2) + (lng1-lng2)*(lng1-lng2));
}
