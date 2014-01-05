/* global require, console, setInterval, exports */
(function(){
    'use strict';
    var server = require('http').Server();
    var port = 5000;
    var io = require("socket.io").listen(server.listen(port));
    var gameData = require('./gameData.js');
    var updateMeta = exports.updateMeta = function(){
        io.sockets.emit('meta', {count : numConnections, streak : gameData.streak});
    };
    var Game = require('./game.js');
    var numConnections = 0;
    var highestStreak = gameData.updateStreak(1);
    io.sockets.on('connection', function(socket){
        numConnections++;
        updateMeta();
        socket.streak = 0;
        socket.on('find',function(data){
            socket.join('waiting');
        });
        socket.on('disconnect', function(data){
            numConnections--;
            updateMeta();
            if(socket.currentGame){
                console.log("Running");
                socket.currentGame.destroy();
            }
        });
    });

    function checkWaitingRoom(){
        var waitingPlayers = io.sockets.clients('waiting');
        var len = Math.floor(waitingPlayers.length / 2);
        for(var i = 0; i < len; i+=2){
            if(waitingPlayers[i] && waitingPlayers[i + 1]){
                Game.makeGame(waitingPlayers[i], waitingPlayers[i+1]);
                waitingPlayers[i].leave('waiting');
                waitingPlayers[i+1].leave('waiting');
            }
        }
    }
    setInterval(checkWaitingRoom,1000);
}());
