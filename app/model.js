// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Marker Schema. This will be the basis of how Marker data is stored in the db
var MarkerSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number },
    location: {type: [Number], required: true}, // [Long, Lat]
    htmlverified: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
MarkerSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
MarkerSchema.index({location: '2dsphere'});

// Exports the MarkerSchema for use elsewhere. Sets the MongoDB collection to be used as: "bitmap-markers"
module.exports = mongoose.model('bitmap-marker', MarkerSchema);