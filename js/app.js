/*global window, jQuery, document, console, io, setInterval, clearInterval */
(function (window, $, io){
    'use strict';
    var rpsApp = window.rpsApp = {};
    var roomId;
    var playerId;
    var userChoice;
    var controls = $(document.getElementById("controls")).hide();
    var ctrlButtons = controls.children('button');
    var results = $("#results");
    var winLost = $("#winlose");
    var again = $("#again").hide();
    var findGameBtn = $("#find-game-btn");
    var messages = [];
    var socket;
    var findIntId;
    var searching = false;
    // Don't shoot me please
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase()+this.slice(1);
    };
    String.prototype.repeat = function(num){
        return new Array( num + 1 ).join( this );
    };
    var updateOnlineCount = rpsApp.updateOnlineCount = function(data){
        $('#online-count').text('('+data.count+')');
        return data.count;
    };
    var updateResults = rpsApp.updateResults = function(data){
        results.show();
        winLost.show();
        if(data.results.length > 1){
            results.text(data.results[0].capitalize() + " " + data.results[2] + " " + data.results[1].capitalize());
        }else{
            results.text(data.results[0]);
        }
        if(data.winner){
            winLost.text("You Win!");
            winLost.addClass('winner').removeClass('loser');
        }else if(data.winner === false){
            winLost.text("You Lose!");
            winLost.addClass('loser').removeClass('winner');
        }
        again.fadeIn(400);
    };
    var beginGame = rpsApp.beginGame = function(data){
        searching = false;
        clearInterval(findIntId);
        findGameBtn.text("Found Player!");
        findGameBtn.delay(700).fadeOut(500);
        controls.fadeIn(500);
    };
    var restartGame = rpsApp.restartGame = function(data){
        ctrlButtons.each(function(index,el){
            $(this).attr('disabled', false).removeClass('disabled-btn');
        });
        again.fadeOut(300);
        results.fadeOut(300);
        winLost.fadeOut(300);
        again.text("Again?");
    };
    rpsApp.setupSocket = function(){
        socket = io.connect('http://localhost:5000');
        socket.on('online_count', updateOnlineCount);
        socket.on('results', updateResults);
        socket.on('found', beginGame);
        socket.on('again', restartGame);
    };
    rpsApp.setupEvents = function(){
        again.click(function(evt){
            socket.emit("again");
            again.text("Waiting on Opponent");
        });
        findGameBtn.click(function(evt){
            if(socket.socket.connected === false) return;
            var self = $(this);
            if(!searching){
                socket.emit('find');
                searching = true;
                var dots = 0;
                findIntId = setInterval(function(){
                    if(dots > 3) dots = 0;
                    self.text('Finding an Opponent' + '.'.repeat(dots));
                    dots++;
                },600);
            }else{
                socket.emit("stop_search");
                clearInterval(findIntId);
                searching = false;
                self.text("Find an Opponent");
            }
        });
        ctrlButtons.click(function(e){
            //if(!connected) return;
            socket.emit('choice', {choice : $(this).data('choice')});
            ctrlButtons.each(function(index,el){
                $(this).attr('disabled', true).addClass('disabled-btn');
            });
            userChoice = $(this).attr('disabled', false).removeClass('disabled-btn');
        });
    };
    rpsApp.start = function(){
        rpsApp.setupSocket();
        rpsApp.setupEvents();
    };

}(window, jQuery, io) );
