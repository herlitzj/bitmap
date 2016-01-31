// Dependencies
var mongoose        = require('mongoose');
var Marker          = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all markers in the db
    app.get('/markers', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Marker.find({});
        query.exec(function(err, markers){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all markers
            res.json(markers);
        });
    });


    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new markers in the db
    app.post('/markers', function(req, res){

        // Creates a new Marker based on the Mongoose schema and the post bo.dy
        var newmarker = new Marker(req.body);

        // New Marker is saved in the db.
        newmarker.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new marker
            res.json(req.body);
        });
    });

    // Retrieves JSON records for all markers that meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var minPrice        = req.body.minPrice;
        var maxPrice        = req.body.maxPrice;
        var reqVerified     = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Marker.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }
        
        // ...include filter by Min Price
        if(minPrice){
            query = query.where('price').gte(minPrice);
        }

        // ...include filter by Max Price
        if(maxPrice){
            query = query.where('price').lte(maxPrice);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, markers){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of all markers that meet the criteria
            res.json(markers);
        });
    });

    app.post('/markerinfo', function(req, res){
        var _id = req.body.id

        var query = Marker.find({});

        query = query.where('_id').equals(_id);

        // Execute Query and Return the Query Results
        query.exec(function(err, marker){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of marker
            console.log(marker);
            res.json(marker);
        });
    });
};  