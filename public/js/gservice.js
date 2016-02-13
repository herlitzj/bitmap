
// Creates the gservice factory. This will be the primary means 
//by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters 
        //(lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used 
                //(to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/markers').success(function(response){

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of markers into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var marker = response[i];

                // Create popup windows for each record
                var  contentString =
                    '<p><b>Title</b>: ' + marker.title +
                    '<br><b>Price</b>: $' + marker.price +
                    '<br><b>Description</b>:' + marker.description +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(marker.location[1], marker.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    id: marker._id,
                    title: marker.title,
                    description: marker.description,
                    price: marker.price,
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

// Initializes the map
var initialize = function(latitude, longitude, filter) {


    // If map has not been created...
    if (!map){

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};
        
        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: myLatLng
        });

    }

    // If a filter was used set the icons yellow, otherwise blue
    if(filter){
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    else{
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            icon: icon,
        });

        // For each marker created, add a listener that checks for mouseover
        google.maps.event.addListener(marker, 'mouseover', function(e){

            // When hovered, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });

        // For each marker created, add a listener that checks for mouseover
        google.maps.event.addListener(marker, 'mouseout', function(e){

            // When hovered, open the selected marker's message
            currentSelectedMarker = n;
            n.message.close(map, marker);
        });

        // For each marker created, add a listener that checks for mouseover
        google.maps.event.addListener(marker, 'click', function(e){
            currentSelectedMarker = n;
            window.location.href = window.location.origin + "/#/marker/" + n.id;
        });
    });

    // Set initial location as a red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        // animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            // animation: google.maps.Animation.BOUNCE,
            map: map,
            url: window.location.origin,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);

        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});