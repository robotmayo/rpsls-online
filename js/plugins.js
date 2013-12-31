/*global window, jQuery */
(function(window,$){
    $.fn.invisible = function(){
        return this.addClass('invisible');
    };
    $.fn.visible = function(){
        return this.removeClass('invisible');
    };
}(window, jQuery));
