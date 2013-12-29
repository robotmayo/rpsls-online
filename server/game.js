/*global exports*/

exports.makeGame = function(player1,player2){
    var game = {};
    player1.currentGame = player2.currentGame = game;
};

