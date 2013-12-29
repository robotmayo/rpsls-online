/* global require, exports */
var crypto = require('crypto');

exports.createPlayer = function(socket){
    var player = {};
    var uid = crypto.randomBytes(16).toString('hex');
    player.choice = '';
    player.streak = 0;
    player.currentGame;
    player.getUid = function(){return uid;};
    socket.player = player;
};
