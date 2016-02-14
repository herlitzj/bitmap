// Declares the initial angular module "meanMapApp". 
//Module grabs other controllers and services.
var app = angular.module('bitMapApp', ['dropCtrl', 'geolocation', 'gservice',
                                       'queryCtrl', 'markerCtrl', 'browseCtrl',
                                       'ngRoute'])

// Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Drop Control Panel
        $routeProvider.when('/browse', {
            controller: 'browseCtrl', 
            templateUrl: '/partials/browseMarkers.html',

        // Find Control Panel
        }).when('/drop', {
            controller: 'dropCtrl',
            templateUrl: '/partials/dropForm.html',

        // Find Control Panel
        }).when('/find', {
            controller: 'queryCtrl',
            templateUrl: '/partials/queryForm.html',

        //Show individual Markers
        }).when('/marker/:id', {
            controller: 'markerCtrl',
            templateUrl: 'partials/showMarker.html',
            
        // All else forward to the Drop Control Panel
        }).otherwise({redirectTo:'/browse'})
    });
