/*global exports*/
(function(){
    var serverStreak = 0;
    exports.data = function(){
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
    var choices = [
        'spock',
        'paper',
        'scissors',
        'lizard',
        'rock'
    ];
    return {winMap : winMap, choices : choices};
}();
exports.updateStreak = function(num){
    if(num > serverStreak) {
        serverStreak = num;
        exports.streak = serverStreak;
    }
    return serverStreak;
};
exports.streak = serverStreak;

}());
