/*global window, jQuery, document, console, io */
(function (window, $, io){
    'use strict';
    var results = $(document.getElementById("results"));
    var computerChoice = document.getElementById("computer-choice");
    var choices = ['rock','paper','scissors','lizard','spock'];
    var roomId;
    var playerId;
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
    // Don't shoot me please
    String.prototype.capitalize = function(){
        return this.charAt(0).toUpperCase()+this.slice(1);
    };
    function pickWinner(a,b){
        console.log(a,b);
        console.log(a+b);
        if(a == b){
            updateText('Its a tie!');
            return;
        }
        if(winMap[a+b] !== undefined){
            updateText(a.capitalize() + " " + winMap[a+b] + " " + b.capitalize() +'You win!');
        }else{
            updateText(b.capitalize() + " " + winMap[b+a] + " " + a.capitalize() +'You lost!');
        }
    }
    
    $.fn.invisible = function(){
        return this.css('visibility', 'hidden');
    };
    $.fn.visible = function(){
        return this.css('visibility', 'visible');
    };
    $(window).ready(function(){
        var messages = [];
        var socket = io.connect('http://localhost:3700');
        socket.on('begin',function(data){
            roomId = data.roomId;
            playerId = data.playerId;
            console.log("Begun", roomId, playerId);
        });
        socket.on('results', function(data){
            if(data.winner == ''){
                results.text("Its a tie!");
            }
            if(data.winner == playerId){
                results.text(data.results[0].capitalize()+" " + data.results[2] + " " + data.results[1].capitalize() + " You Win!");
            }else{
                results.text(data.results[0].capitalize()+" " + data.results[2] + " " + data.results[1].capitalize() + " You Lose!");
            }
        });
        var buttons = $(results).parent().children('button');
        buttons.click(function(evt){
            socket.emit('picked',{move : $(this).text().toLowerCase(), roomId : roomId, playerId : playerId});
            var self = this;
            $(this).attr('disabled',true);
            buttons.each(function(index,element){
                if(element != self){
                    $(element).invisible();
                }
            });
        });
    });
                    
}(window, jQuery, io) );