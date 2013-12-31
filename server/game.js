/*global exports, require, console*/
var gameConstants = require('./gameConstants.js').data;
var Player = require('./player.js');
var _ = require('underscore')._;
exports.makeGame = function(socket1,socket2){
    var game = {};
    var player1 = Player.createPlayer(socket1);
    var player2 = Player.createPlayer(socket2);
    socket1.emit('found');
    socket2.emit('found');
    game.compare = function(){
        var a = player1.choice;
        var b = player2.choice;
        console.log(a,b);
        if(_.contains(gameConstants.choices,a) && _.contains(gameConstants.choices,b)){
            if(a == b){
                player1.socket.emit('results', {winner : '', results : ["Its a Tie!"]});
                player2.socket.emit('results', {winner : '', results : ["Its a Tie!"]});
            }else{
                 if(gameConstants.winMap[a+b] !== undefined){
                    player1.streak += 1;
                    player1.socket.emit('results',{winner : true, results : [a,b,gameConstants.winMap[a+b]]});
                    player2.socket.emit('results',{winner : false, results : [a,b,gameConstants.winMap[a+b]]});
                }else if(gameConstants.winMap[b+a] !== undefined){
                    player1.socket.emit('results',{winner : false, results : [b,a,gameConstants.winMap[b+a]]});
                    player2.socket.emit('results',{winner : true, results : [b,a,gameConstants.winMap[b+a]]});
                }
            }
            player1.choice = '';
            player2.choice = '';
        }
    };
    game.destroy = function(failed){
        if(failed){
            player1.socket.emit('error');
            player2.socket.emit('error');
        }else{
            player1.socket.emit('game_end');
            player2.socket.emit('game_end');
        }
        player1.destroyGame();
        player2.destroyGame();
    };
    game.restart = function(){
        if(player1.again && player2.again){
            player1.again = player2.again = false;
            player1.choice = player2.choice = '';
            player1.socket.emit('again');
            player2.socket.emit('again');
        }
    };
    player1.currentGame = game;
    player2.currentGame = game;
};

