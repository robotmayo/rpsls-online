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
    $(window).ready(function(){
        var messages = [];
        var socket = io.connect('http://localhost:3700');
        var buttons = $(results).parent().children('button');
        socket.on('online_count', function(data){
            $('#online-count').text('('+data.count+')');
        });
        socket.on('results',function(data){
            console.log(data);
        });
        $("#find-game-btn").click(function(evt){
            socket.emit('find');
        });
        $('#controls').children('button').click(function(e){
            console.log($(this).data('choice'));
            socket.emit('choice', {choice : $(this).data('choice')});
        });
    });
                    
}(window, jQuery, io) );
