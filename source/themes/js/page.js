

$(window).on('scroll', function () {
    var $that = $('.top_tab'),
        top = $that.offset().top,
        stop = $('body').scrollTop();

    if ((top - stop) <= 60) {
        $that.addClass("t_fixed");
    } else {
        $that.removeClass("t_fixed");
    }
    console.log(top - stop);
});