/*global window, jQuery */
(function(window,$){
    $.fn.invisible = function(){
        return this.css('visibility', 'hidden');
    };
    $.fn.visible = function(){
        return this.css('visibility', 'visible');
    };
}(window, jQuery));
