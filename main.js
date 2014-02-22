//Time variables
var timeToPoint;
var totalTime;
var lastTime;
var currentTime;
var lastDiff;

var map;
var marker;
var currentIndex;
var diff;

var allItems = new Array();

function initialize() {
    var latlng = new google.maps.LatLng(51.50788400951119,-0.1368303833007758);
    var myOptions = {
      zoom: 3,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	fetchFirst();
	//loadLocations();
}

function takeRelevantData(items,addMarkers) {
	var pos;
	var pos2;
	for(var i=0; i < items.length; ++i) {
		var item = items[i];
		if(item.place==undefined) {
			continue;
		}
		pos = new Object();
		pos.lat = item.place.location.latitude;
		pos.lng = item.place.location.longitude;
		pos.location = new google.maps.LatLng(pos.lat,pos.lng);
		pos.name = item.place.name;
		pos.id = item.id;
		pos.created = item.created_time;
		var start = Math.max(allItems.length-40,0);
		for(var j=start; j < allItems.length; ++j) {
			pos2 = allItems[j];
			if(pos.id==pos2.id) {
				console.log("found duplicate " + pos.id + " == " + pos2.id);
				console.log("duplicate location " + j + " == " + allItems.length + " i " + i);
				return false;
			}
		}
		console.log("added " + pos.id);
		allItems.push(pos);
		if(addMarkers) {
			addMarker(pos);
		}
		
	}
	return true;
}

function loadLocations() {
	var pos;

	currentIndex = allItems.length-1;
	pos = allItems[currentIndex];
	var pos2 = allItems[currentIndex-1];
	var firstPos = allItems[0];
	
	
	var position = new google.maps.LatLng(pos.lat,pos.lng);
	var image = "img/plane.png";
	marker = new google.maps.Marker({map:map,position:position,draggable:false,title:pos.name,icon:image});
	var t1 = new Date(pos.created);
	var t2 = new Date(firstPos.created);
	totalTime = t2.getTime()-t1.getTime();
	console.log(totalTime);
	
	
	setupMovement(pos,pos2);
	addAllMarkers();
	setInterval(updateLocation,24);
}

function addAllMarkers() {
	for(var i = 0; i < allItems.length; ++i) {
		addMarker(allItems[i]);
	}
}

function addMarker(pos) {
	var image = "img/marker-blue.png";
	var position = new google.maps.LatLng(pos.lat,pos.lng);
	var marker = new google.maps.Marker({map:map,position:position,draggable:false,title:pos.name,icon:image});
}

function setupMovement(pos,pos2) {
	timeToPoint = 5000;
	console.log(pos);
}

function updateLocation() {
	currentTime = + new Date();
	var delta = currentTime - lastTime;
	lastTime = currentTime;
	if(isNaN(delta)) {
		return;
	}
	var nextPos = allItems[currentIndex-1];
	timeToPoint-=delta;
	var position = marker.getPosition();	
	
	position = moveTowards(position,nextPos.location);
	
	marker.setPosition(position);
	var dist = google.maps.geometry.spherical.computeDistanceBetween(position,nextPos.location);
	if(dist < 100) {
		if(currentIndex > 1) {
			currentIndex--;	
		}
	}
	/*if(timeToPoint <= 0) {
		if(currentIndex > 1) {
			var pos = allItems[currentIndex];
			setupMovement(pos,nextPos);
			currentIndex--;
		}	
	}*/
}

function moveTowards(position,nextPosition) {
	var heading = google.maps.geometry.spherical.computeHeading(position,nextPosition);
	var radHeading = toRad(heading);
	
	var dirX = Math.cos(radHeading);
	var dirY = Math.sin(radHeading);
	
	var lat = position.lat();
	var lng = position.lng();
	lat+=dirX/1000;
	lng+=dirY/1000;
	
	//console.log("("+dirX+","+dirY+")");	
	//console.log("("+lat+","+lng+")");	
	//console.log(heading);
	return new google.maps.LatLng(lat,lng);
}

function toRad(angle) {
	return Math.PI*angle/180;
}

function distance(lat1,lng1,lat2,lng2) {
	return Math.sqrt((lat1-lat2)*(lat1-lat2) + (lng1-lng2)*(lng1-lng2));
}
