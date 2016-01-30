// Declares the initial angular module "meanMapApp". 
//Module grabs other controllers and services.
var app = angular.module('bitMapApp', ['dropCtrl', 'geolocation', 'gservice',
                                       'queryCtrl', 'ngRoute'])

// Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

        // Join Team Control Panel
        $routeProvider.when('/drop', {
            controller: 'dropCtrl', 
            templateUrl: '/partials/dropForm.html',

            // Find Teammates Control Panel
        }).when('/find', {
            controller: 'queryCtrl',
            templateUrl: '/partials/queryForm.html',

            // All else forward to the Join Team Control Panel
        }).otherwise({redirectTo:'/drop'})
    });