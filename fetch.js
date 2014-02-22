var token = "AAAAAAITEghMBAFD54dqcezZBJaBXGvTeintZAfuyJrYof7OIHv8TqWlaOREdbMhk4Lo5DoZAumFjd24dKd58PsVAtyNvZADeLbnnlEbZCqQZDZD";
var firstUrl = "https://graph.facebook.com/me/locations";

var xmlHttp;

function fetchFirst() {
	var url = firstUrl + "?access_token="+token;
	fetchPortion(url);
	
}

function fetchPortion(url) {
	console.log(url);
	xmlHttp=new XMLHttpRequest();
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4 && xmlHttp.status==200) {
			var data = JSON.parse(xmlHttp.responseText);
			if(takeRelevantData(data.data,true)) {
				var next = data.paging.next;
				//console.log(data.paging);
				fetchPortion(next);
			}
			
		}
	}
	xmlHttp.open("GET",url,true);
	xmlHttp.send();
}