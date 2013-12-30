/*global exports*/

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
