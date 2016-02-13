// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Marker Schema. This will be the basis of 
//how Marker data is stored in the db
var UserSchema = new Schema({
    provider: {type: String, required: true},
    uid: {type: String, required: true},
    access_token: {type: String, required: true},
    refresh_token: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Exports the MarkerSchema for use elsewhere. 
//Sets the MongoDB collection to be used as: "bitmap-markers"
module.exports = mongoose.model('bitmap-user', UserSchema);