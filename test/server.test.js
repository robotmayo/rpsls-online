/*global require, describe, it, beforeEach, console, afterEach */
var node_modules = '../server/node_modules/';
var assert = require('assert');
var port = 5000;
var io = require("../server/node_modules/socket.io-client");
var socketURL = 'http://localhost:5000';
describe('Socket', function(){
    var socket1;
    beforeEach(function(done){
        socket1 = io.connect(socketURL, {
            'reconnection delay' : 0,
            'reopen delay' : 0,
            'force new connection' : true
        });
    });
    it('should be connected', function(){
        assert.equal(true, socket1.socket.connected);
    });
    /*afterEach(function(done){
        if(socket1.socket.connected){
            console.log('disconnecting');
            socket1.disconnect();
        }else{
            console.log('No connection to break');
        }
        done();
    });*/
});
