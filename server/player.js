/* global require, exports */
var _ = require('underscore')._;
var gameConstants = require('./gameConstants.js').data;
exports.createPlayer = function(socket){
    var player = {};
    var uid = socket.id;
    player.choice = '';
    player.streak = 0;
    player.currentGame = undefined;
    player.getUid = function(){return uid;};
    player.makeChoice = function(choice){
        console.log(_.contains(gameConstants.choices,choice), gameConstants.choices, choice);
        if(_.contains(gameConstants.choices,choice)){
            player.choice = choice;
        }else{
            socket.emit('invalid_choice');
        }
    };
    player.destroyGame = function(){
        socket.emit('opponent_left');
        socket.currentGame = null;
    };
    socket.on('choice',function(data){
        player.makeChoice(data.choice);
        console.log("Making Choice");
        player.currentGame.compare();
    });
    socket.on('again', function(data){
        player.again = true;
        player.currentGame.restart();
    });
    player.socket = socket;
    return player;
};
