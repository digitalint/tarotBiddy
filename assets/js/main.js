// --------------------------------------------------------------------
// Initialise Variables
// --------------------------------------------------------------------
var tarotReaderBoxContainer = document.getElementById('tarot-reader-box');
var tarotReaderListContainer = document.getElementById('tarot-reader-list');

var sortRandBtn = document.getElementById("sort-random-btn");
var sortASCBtn = document.getElementById("sort-asc-btn");
var sortLocationBtn = document.getElementById("sort-location-btn");


// --------------------------------------------------------------------
// Initialise Sort Button Event Listeners
// --------------------------------------------------------------------
sortRandBtn.addEventListener("click", function() {
	displaySortedBox("random");
});

sortASCBtn.addEventListener("click", function() {
	displaySortedBox("asc");
});

sortLocationBtn.addEventListener("click", function() {
	displaySortedBox("location");
});

// First Page Load Set Sort Order to Random
displaySortedBox("random");


// --------------------------------------------------------------------
// Get Tarot Reader JSON Data
// --------------------------------------------------------------------
function displaySortedBox(sortorder){

	var tarotReaderRequest = new XMLHttpRequest();

	tarotReaderRequest.open('GET', 'http://localhost/wordpress/wp-content/themes/twentyseventeen/assets/json/biddy_readers.json?order=asc');
	tarotReaderRequest.onload = function() {
		if (tarotReaderRequest.status >= 200 && tarotReaderRequest.status < 400) {

			var tarotReaderBoxData = JSON.parse(tarotReaderRequest.responseText);
			var tarotReaderListData = JSON.parse(tarotReaderRequest.responseText);

			// Filter Sort Listener
			if ( sortorder == "random" ) {
				tarotReaderBoxData.sort(function() {
					return .5 - Math.random();
				});
			} else if ( sortorder == "asc" ) {
				tarotReaderBoxData.sort(function (a, b) {
					return a.displayname.localeCompare(b.displayname);
				});
			} else if ( sortorder == "location" ) {
				tarotReaderBoxData.sort(function (a, b) {
					return a.name.localeCompare(b.name);
				});
			}

			// Send Data to Render Functions for Box and List
			renderBoxHTML(tarotReaderBoxData);

			// Compare Name Strings - Extract Last Name for List
			function compareNameStrings(a, b) {
			  // Assuming you want case-insensitive comparison
			  a = a.split(" ").splice(-1);
			  b = b.split(" ").splice(-1);

			  return (a < b) ? -1 : (a > b) ? 1 : 0;
			}

			// Sort List by Last Name
			tarotReaderListData.sort(function(a, b) {
			  return compareNameStrings(a.name, b.name);
			})

			renderListHTML(tarotReaderListData);

		} else {
			console.log("Connected to the server, but it returned an error.");
		}
	};

	tarotReaderRequest.onerror = function() {
	  console.log("Connection error");
	};

	tarotReaderRequest.send();
}


// --------------------------------------------------------------------
// Display Tarot Reader Box Data
// --------------------------------------------------------------------
function renderBoxHTML(data) {
	// Render Tarot Reader Data For Box in HTML
	var tarotReaderBoxContentString = "";
	var hyperLink = "";

	for (i=0; i<data.length; i++){
		if ( data[i].website != "") {
			hyperLink = '<a href=' + data[i].website + ' target="_blank">';
		} else if ( data[i].facebook != "" ) {
			hyperLink = '<a href=' + data[i].facebook + ' target="_blank">';
		} else {
			hyperLink = '<a href="#">';
		}
		tarotReaderBoxContentString += '<div class="reader-box dark-purple">';
		tarotReaderBoxContentString += hyperLink + '<p class="reader-title">' + data[i].displayname.toUpperCase() + '</p></a>';
		tarotReaderBoxContentString += '<p class="reader-subtitle">Location</p>';
		if ( data[i].noteslinkphoto == "") {
			tarotReaderBoxContentString += hyperLink + '<img src="https://www.biddytarot.com/wp-content/uploads/2015/11/CBTR-Badge-Dark-1.png" class="image-cropper" /></a>';
		} else {
			tarotReaderBoxContentString += hyperLink + '<img src=' + data[i].noteslinkphoto + ' class="image-cropper" /></a>';
		}
		tarotReaderBoxContentString += '<div class="content-box">'
	    tarotReaderBoxContentString += '<p class="reader-desc">' +  data[i].descriptionofservices.substring(0, 155) + '...</p>';
	    tarotReaderBoxContentString += '</div>'
	    tarotReaderBoxContentString += hyperLink + '<div class="chat-icon chat-icon-color"></div></a>';
		tarotReaderBoxContentString += '</div>';
	}

	tarotReaderBoxContainer.innerHTML = tarotReaderBoxContentString;
}


// --------------------------------------------------------------------
// Display Tarot Reader List Data
// --------------------------------------------------------------------
function renderListHTML(data) {
	// Render Tarot Reader Data For List in HTML
	var tarotReaderListString = "";
	
	tarotReaderListString += '<p>&nbsp;</p>';
	tarotReaderListString += '<div class="reader-list-title">ALL OUR BIDDY TAROT CERTIFIED READERS!</div>';
	tarotReaderListString += '<p>&nbsp;</p>';
	for (i=0; i<data.length; i++){
		tarotReaderListString += '<div class="reader-list-box">';
		tarotReaderListString += '<div class="reader-name-list">' + data[i].name.toUpperCase() + '</div>';
		tarotReaderListString += '</div>';
	}

	tarotReaderListContainer.innerHTML = tarotReaderListString;
	
}

