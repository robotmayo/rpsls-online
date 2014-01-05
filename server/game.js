/*global exports, require, console*/
(function(){
    var gameData = require('./gameData.js');
    var Player = require('./player.js');
    var _ = require('underscore')._;
    var updateMeta = require('./index.js').updateMeta;
    exports.makeGame = function(socket1,socket2){
        var game = {};
        var player1 = Player.createPlayer(socket1);
        var player2 = Player.createPlayer(socket2);
        socket1.emit('found');
        socket2.emit('found');
        socket1.currentGame = game;
        socket2.currentGame = game;
        game.compare = function(){
            var a = player1.choice;
            var b = player2.choice;
            console.log(a,b);
            if(_.contains(gameData.data.choices,a) && _.contains(gameData.data.choices,b)){
                if(a == b){
                    player1.socket.emit('results', {winner : '', results : ["Its a Tie!"]});
                    player2.socket.emit('results', {winner : '', results : ["Its a Tie!"]});
                }else{
                     if(gameData.data.winMap[a+b] !== undefined){
                        socket1.streak += 1;
                        socket2.streak = 0;
                        player1.socket.emit('results',{winner : true, results : [a,b,gameData.data.winMap[a+b]], streak : socket1.streak});
                        player2.socket.emit('results',{winner : false, results : [a,b,gameData.data.winMap[a+b]]});
                        if(socket1.streak == gameData.updateStreak(socket1.streak)){
                            updateMeta();
                        }
                    }else if(gameData.data.winMap[b+a] !== undefined){
                        socket1.streak = 0;
                        socket2.streak += 1;
                        player1.socket.emit('results',{winner : false, results : [b,a,gameData.data.winMap[b+a]]});
                        player2.socket.emit('results',{winner : true, results : [b,a,gameData.data.winMap[b+a]], streak : socket2.streak});
                        if(socket2.streak == gameData.updateStreak(socket2.streak)){
                            updateMeta();
                        }
                    }
                }
                player1.choice = '';
                player2.choice = '';
            }
        };
        game.destroy = function(){
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
}());

