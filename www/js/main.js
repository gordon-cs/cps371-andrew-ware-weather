window.onload = function() {
    setTimeout(function() { removeLoadingGif() }, 5000);
}

var removeLoadingGif = function() {
    $('.loading').hide();
    setTimeout(function() {
        $('.wrapper').show();
    }, 200);
}

function setActiveDay(n) {
    for (var i = 0; i < 7; i++) {
        if (i != n) {
            $('#day' + i).attr('class', '');
        } else $('#day' + i).attr('class', 'active');
    }
}