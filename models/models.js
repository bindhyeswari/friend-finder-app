var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GoogleUserModel = mongoose.model('user', mongoose.Schema({
    email: String,
    userid: {
        type: String,
        unique: true
    },
    profile: Schema.Types.Mixed,
    friends: {
        type: Schema.Types.Mixed,
        default: {}
    }
}));

var PositionModel = mongoose.model('position', mongoose.Schema({
    gid: String, // Google User ID
    coords: Schema.Types.Mixed,
    timestamp: Date
}));

module.exports = {
    GoogleUserModel: GoogleUserModel,
    PositionModel: PositionModel
};