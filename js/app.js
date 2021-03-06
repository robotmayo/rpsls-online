/*global window, jQuery, document, console, io, setInterval, clearInterval, _ */
(function (window, $, io, _){
    'use strict';
    var rpsApp = window.rpsApp = {};
    var userChoice;
    var username;
    var streak;
    var bestStreak;
    var serverRecord;
    var controls = $(document.getElementById("controls")).hide();
    var ctrlButtons = controls.children('button');
    var results = $("#results");
    var winLost = $("#winlose");
    var userNameInput = $("#username").hide();
    var again = $("#again").hide();
    var findGameBtn = $("#find-game-btn");
    var streakText = $("#streaks");
    var pStreakText = $("#player-streak");
    var serverStreakText = $("#server-streak");
    var socket;
    var findIntId;
    var searching = false;
    var options = rpsApp.options = {
        fadeOut : 300,
        jDelay : 700,
        fadeIn : 300,
        findingDelay : 600
    };
    // Don't shoot me please
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase()+this.slice(1);
    };
    String.prototype.repeat = function(num){
        return new Array( num + 1 ).join( this );
    };
    var updateMeta = rpsApp.updateMeta = function(data){
        $('#online-count').text('('+data.count+')');
        serverStreakText.text(data.streak);
        return data;
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
            streak = data.streak;
        }else if(data.winner === false){
            winLost.text("You Lose!");
            winLost.addClass('loser').removeClass('winner');
            streak = 0;
        }
        pStreakText.text(streak);
        again.fadeIn(options.fadeIn);
    };
    var beginGame = rpsApp.beginGame = function(data){
        searching = false;
        clearInterval(findIntId);
        findGameBtn.text("Found Player!");
        findGameBtn.delay(options.jDelay).fadeOut(options.fadeOut);
        controls.fadeIn(options.fadeIn);
    };
    var restartGame = rpsApp.restartGame = function(data){
        ctrlButtons.each(function(index,el){
            $(this).attr('disabled', false).removeClass('disabled-btn');
        });
        again.fadeOut(options.fadeOut);
        results.fadeOut(options.fadeOut);
        winLost.fadeOut(options.fadeOut);
        again.text("Again?");
    };
    var endGame = rpsApp.endGame = function(){
        controls.fadeOut(options.fadeOut);
    };
    rpsApp.setupSocket = function(){
        socket = io.connect('http://localhost:5000');
        socket.on('meta', updateMeta);
        socket.on('results', updateResults);
        socket.on('found', beginGame);
        socket.on('again', restartGame);
        socket.on('game_end', endGame);
        return socket;
    };
    rpsApp.setupEvents = function(){
        again.click(function(evt){
            socket.emit("again");
            again.text("Waiting on Opponent");
        });
        findGameBtn.click(function(evt){
            var self = $(this);
            if(!searching){
                 if(socket.socket.connected === false){
                     findGameBtn.text("Server appears to be down. :(");
                     return;
                 }
                socket.emit('find');
                searching = true;
                var dots = 0;
                findIntId = setInterval(function(){
                    if(dots > 3) dots = 0;
                    self.text('Finding an Opponent' + '.'.repeat(dots));
                    dots++;
                },options.findingDelay);
            }else{
                socket.emit("stop_search");
                clearInterval(findIntId);
                searching = false;
                self.text("Find an Opponent");
            }
        });
        ctrlButtons.click(function(e){
            socket.emit('choice', {choice : $(this).data('choice')});
            ctrlButtons.each(function(index,el){
                $(this).attr('disabled', true).addClass('disabled-btn');
            });
            userChoice = $(this).attr('disabled', false).removeClass('disabled-btn');
        });
    };
    rpsApp.start = function(opt){
        if(opt){
            _.extend(opt,rpsApp.options);
        }
        rpsApp.setupSocket();
        rpsApp.setupEvents();
    };

}(window, jQuery, io, _) );
