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
};  