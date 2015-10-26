var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoogleUserModel = mongoose.model('user', mongoose.Schema({
    userid: {
        type: String,
        unique: true
    },
    profile: Schema.Types.Mixed,
    friends: Array[String]
}));

var PositionModel = mongoose.model('position', mongoose.Schema({
    gid: String, // Google User ID
    coords: Schema.Types.Mixed,
    timestamp: Date
}));

module.exports = {
    GoogleUserModel: GoogleUserModel
};