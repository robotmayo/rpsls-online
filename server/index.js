/* global require, console */
'use strict'
var express = require("express");
var app = express();
var io = require("socket.io").listen(app.listen(port));
var crypto = require('crypto');
var port = 3700;
var choices = ['rock','paper','scissors','lizard','spock'];
var games = {}
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
    // Check for any other players
    var waitingPlayers = io.sockets.clients('waiting');
    // If there are other waiting players lets connect to them
    if(waitingPlayers.length > 0){
        var pardna = waitingPlayers.pop();
        pardna.leave('waiting');
        var gameRoomId = crypto.randomBytes(16).toString('hex');
        var playerOneId = crypto.randomBytes(16).toString('hex');
        var playerTwoId = crypto.randomBytes(16).toString('hex');
        var game = makeGame(playerOneId,playerTwoId,socket,pardna);
        socket.emit('begin',{roomId : gameRoomId, playerId : playerOneId });
        pardna.emit('begin',{roomId : gameRoomId, playerId : playerTwoId });
        socket.on('picked',picked);
        pardna.on('picked',picked);
        games[gameRoomId] = game;
    }else{
        socket.join('waiting');
        console.log('Joined Waiting');
    }
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
            return;
        }
        if(winMap[a+b] !== undefined){
            game.playerOne.socket.emit('results',{winner : game.playerOne.id, results : [a,b,winMap[a+b]]});
            game.playerTwo.socket.emit('results',{winner : game.playerOne.id, results : [a,b,winMap[a+b]]});
        }else if(winMap[b+a] !== undefined){
            game.playerOne.socket.emit('results',{winner : game.playerTwo.id, results : [b,a,winMap[a+b]]});
            game.playerTwo.socket.emit('results',{winner : game.playerTwo.id, results : [b,a,winMap[a+b]]});
        }
    }
}




