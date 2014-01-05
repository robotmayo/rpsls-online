/* global require, console, setInterval */
(function(){
    'use strict';
    var server = require('http').Server();
    var port = 5000;
    var io = require("socket.io").listen(server.listen(port));
    var Game = require('./game.js');
    var numConnections = 0;
    io.sockets.on('connection', function(socket){
        numConnections++;
        updateOnlineCount();
        socket.on('find',function(data){
            socket.join('waiting');
        });
        socket.on('disconnect', function(data){
            numConnections--;
            updateOnlineCount();
            if(socket.currentGame){
                console.log("Running");
                socket.currentGame.destroy();
            }
        });
    });
    
    function updateOnlineCount(){
        io.sockets.emit('online_count', {count : numConnections});
    }
    
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
