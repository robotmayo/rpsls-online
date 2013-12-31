/*global window, jQuery, document, console, io, setInterval, clearInterval */
(function (window, $, io){
    $(window).ready(function(){
        'use strict';
        var controls = $(document.getElementById("controls")).hide();
        var ctrlButtons = controls.children('button');
        var computerChoice = document.getElementById("computer-choice");
        var choices = ['rock','paper','scissors','lizard','spock'];
        var roomId;
        var playerId;
        var userChoice;
        var results = $("#results");
        var winLost = $("#winlose");
        var again = $("#again").hide();
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
        var findGameBtn = $("#find-game-btn");
        // Don't shoot me please
        String.prototype.capitalize = function(){
            return this.charAt(0).toUpperCase()+this.slice(1);
        };
        String.prototype.repeat = function(num){
            return new Array( num + 1 ).join( this );
        };
        var messages = [];
        var socket = io.connect('http://localhost:3700');
        var findIntId;
        var searching = false;
        socket.on('online_count', function(data){
            $('#online-count').text('('+data.count+')');
        });
        socket.on('results',function(data){
            results.show();
            winLost.show();
            if(data.results.length > 1){
                results.text(data.results[0].capitalize() + " " + data.results[2] + " " + data.results[1].capitalize());
            }else{
                results.text(data.results[0]);
            }
            if(data.winner){
                winLost.text("You Win!");
                winLost.addClass('winner');
            }else if(data.winner === false){
                winLost.text("You Lose!");
                winLost.addClass('loser');
            }
            again.fadeIn(400);
        });
        socket.on('found', function(data){
            searching = false;
            clearInterval(findIntId);
            findGameBtn.text("Found Player!");
            findGameBtn.delay(700).fadeOut(500);
            controls.fadeIn(500);
        });
        again.click(function(evt){
           socket.emit("again");
            again.text("Waiting on Opponent");
        });
        socket.on('again', function(data){
            ctrlButtons.each(function(index,el){
                $(this).attr('disabled', false).removeClass('disabled-btn');
            });
            again.fadeOut(300);
            results.fadeOut(300);
            winLost.fadeOut(300);
            again.text("Again?");
        });
        findGameBtn.click(function(evt){
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
    });
                    
}(window, jQuery, io) );
