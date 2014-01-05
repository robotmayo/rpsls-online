/* global require, exports */
(function(){
    var _ = require('underscore')._;
    var gameData = require('./gameData.js').data;
    exports.createPlayer = function(socket){
        var player = {};
        var uid = socket.id;
        player.choice = '';
        player.streak = 0;
        player.getUid = function(){return uid;};
        player.makeChoice = function(choice){
            if(_.contains(gameData.choices,choice)){
                player.choice = choice;
            }else{
                socket.emit('invalid_choice');
            }
        };
        player.destroyGame = function(){
            socket.emit('game_end');
            socket.currentGame = null;
        };
        socket.on('choice',function(data){
            player.makeChoice(data.choice);
            player.currentGame.compare();
        });
        socket.on('again', function(data){
            player.again = true;
            player.currentGame.restart();
        });
        player.socket = socket;
        return player;
    };

 }());
