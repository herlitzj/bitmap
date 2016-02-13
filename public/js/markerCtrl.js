// Creates the markerCtrl Module and Controller. Note that it depends on 
//the 'geolocation' module and service.
var markerCtrl = angular.module('markerCtrl', ['geolocation', 'gservice']);
markerCtrl.controller('markerCtrl', function($scope, $http, $rootScope, 
                                            $location, geolocation, gservice){


    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};

    //extract the marker ID from the url
    var markerId = {
        id: $location.path().split("/").pop(),
    }

    // Post the queryBody to the /query POST route to retrieve the filtered results
    $http.post('/markerinfo', markerId)

        // Store the filtered results in queryResults
        .success(function(queryResults){

            // Query Body and Result Logging
            // console.log("QueryBody:");
            // console.log(queryBody);
            // console.log("QueryResults:");
            // console.log(queryResults);

            //get the marker object that was returned
            var marker = queryResults[0];

            //get data from object for display
            $scope.formData.title = marker.title;
            $scope.formData.description = marker.description;
            $scope.formData.price = marker.price;

            //get lat/lon (flip from MongoDB location)
            var latitude = marker.location[1];
            var longitude = marker.location[0];

            //send to gservice to render map
            gservice.refresh(latitude, longitude, queryResults);

        })
        .error(function(queryResults){
            console.log('Error ' + queryResults);
        })



    // gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    // Functions
    // ----------------------------------------------------------------------------

});