/* global require, console, setInterval */
(function(){
    'use strict';
    var express = require("express");
    var app = express();
    var port = 3700;
    var io = require("socket.io").listen(app.listen(port));
    var crypto = require('crypto');
    var choices = ['rock','paper','scissors','lizard','spock'];
    var games = {};
    var winMap = {
            'paperrock' : 'covers',
            'paperspock' : 'disproves',
            'rocklizard' : 'crushes',
            'rockscissors' : 'crushes',
            'lizardspock' : 'poisons',
            'lizardpaper' : 'eats',
            'spockscissors' : 'smashes',
            'spockrock' : 'vaporizes',
            'scissorspaper' : 'cuts',
            'scissorslizard' : 'decapitates'
    };
    function makeGame(playerOneId,playerTwoId, playerOneSocket, playerTwoSocket){
        return {
            playerOne : {id : playerOneId, move : '', socket : playerOneSocket},
            playerTwo : {id : playerTwoId, move : '', socket : playerTwoSocket}
        };
    }
    io.sockets.on('connection', function(socket){
        socket.join('waiting');
        console.log('Joined Waiting');
    });
    
    function picked(data){
        var theGame = games[data.roomId];
        if(theGame !== undefined){
            if(data.playerId == theGame.playerOne.id){
                theGame.playerOne.move = data.move;
                resolve(theGame);
            }else if(data.playerId == theGame.playerTwo.id){
                theGame.playerTwo.move = data.move;
                resolve(theGame);
            }else{
                console.log('Invalid ID');
            }
        }else{
            console.log("Couldnt find game");
        }
    }
    
    function resolve(game){
        var a = game.playerOne.move;
        var b = game.playerTwo.move;
        if(a !== '' && b !== ''){
            if(game.playerOne.move == game.playerTwo.move){
                game.playerOne.socket.emit('results', {winner : ''});
                game.playerTwo.socket.emit('results', {winner : ''});
            }else{
                 if(winMap[a+b] !== undefined){
                    game.playerOne.socket.emit('results',{winner : game.playerOne.id, results : [a,b,winMap[a+b]]});
                    game.playerTwo.socket.emit('results',{winner : game.playerOne.id, results : [a,b,winMap[a+b]]});
                }else if(winMap[b+a] !== undefined){
                    game.playerOne.socket.emit('results',{winner : game.playerTwo.id, results : [b,a,winMap[b+a]]});
                    game.playerTwo.socket.emit('results',{winner : game.playerTwo.id, results : [b,a,winMap[b+a]]});
                }   
            }
            game.playerOne.move = '';
            game.playerTwo.move = '';
        }
    }
    
    function checkWaitingRoom(){
        var waitingPlayers = io.sockets.clients('waiting');
        for(var i = 0; i < Math.floor(waitingPlayers.length / 2); i+=2){
            if(waitingPlayers[i] && waitingPlayers[i + 1]){
                match(waitingPlayers[i], waitingPlayers[i+1]);
            }
        }
    }
    
    function match(socket1, socket2){
        socket1.leave('waiting');
        socket2.leave('waiting');
        var gameRoomId = crypto.randomBytes(16).toString('hex');
        var playerOneId = crypto.randomBytes(16).toString('hex');
        var playerTwoId = crypto.randomBytes(16).toString('hex');
        var game = makeGame(playerOneId,playerTwoId,socket1,socket2);
        socket1.emit('begin',{roomId : gameRoomId, playerId : playerOneId });
        socket2.emit('begin',{roomId : gameRoomId, playerId : playerTwoId });
        socket1.on('picked',picked);
        socket2.on('picked',picked);
        games[gameRoomId] = game;
    }
    
    setInterval(checkWaitingRoom,1000);
}());