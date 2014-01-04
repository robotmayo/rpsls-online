/*global describe, it, beforeEach, console, rpsApp, afterEach, chai,$, assert */

describe('index', function(){
    /*var socket = rpsApp.setupSocket();
    it('should be connected', function(){
        assert.equal(true, socket.socket.connected);
    });*/
    describe('Socket Events', function(){
        it('should update the online count', function(){
            var count = rpsApp.updateOnlineCount({count : 1});
            assert(1, count);
            assert('(1)',$("#online-count").text());
        });
        describe('Begin Game', function(){
            it('Should say found player', function(){
                rpsApp.beginGame({});
                assert('Found Player!', $('#find-game-btn').text());
            });
            it('Should hide the find game button', function(){
                rpsApp.beginGame({delay : 0, fade : 0});
                assert(true,$('#find-game-btn').is(':hidden'));
            });
            it('Should reveal the controls', function(){
                rpsApp.beginGame({delay : 0, fade : 0});
                assert(false,$('#controls').is(':hidden'));
            });
        });
        describe('Restart Game', function(){
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
            var a = 'paper';
            var b = 'rock';
            var results = $("#results");
            var winLost = $("#winlose");
            var again = $("#again");
            rpsApp.updateResults({winner : true, results : [a,b,winMap[a+b]]});
            it('Should reveal the show and winlost text', function(){
                assert(false, results.is(':hidden'));
                assert(false, winLost.is(':hidden'));
            });
            it('Should say Paper covers Rock', function(){
                assert('Paper covers Rock', results.text());
            });
            it('Should declare me the winner and apply and remove the correct css classes', function(){
                assert('You Win!', winLost.text());
                assert(true, winLost.hasClass('winner'));
                assert(false, winLost.hasClass('loser'));
            });
            it('Should reveal the again button', function(){
                assert(true, again.is(':visible'));
            });
        });
    });
});
