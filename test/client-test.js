/*global describe, it, beforeEach, console, rpsApp, afterEach, chai,$, assert */
describe('index', function(){
    /*var socket = rpsApp.setupSocket();
    it('should be connected', function(){
        assert.equal(true, socket.socket.connected);
    });*/
    describe('Socket Events', function(){
        it('should update the online count', function(){
            var count = rpsApp.updateOnlineCount({count : 1});
            assert.equal(1, count);
            assert.equal('(1)',$("#online-count").text());
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
    });
});
