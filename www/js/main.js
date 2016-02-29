window.onload = function() {
    setTimeout(function() { removeLoadingGif() }, 6500);
    $(".seven-day-a").click(function() {

        var id = $(this).children("li").attr("id");
        for (var i = 0; i < 7; i++) {
            if (i != id[id.length - 1]) {
                $("#day" + i).animate({
                    height: "34px",
                    width: "100%"
                }, 200);
                $("#day" + i + "-content").animate({
                    fontSize: "15px"
                }, 200);
                $("#day" + i + "-name").css("font-size", "15px");
                $("#day" + i + "-content").attr("class", ".seven-day-li-content");
                $("#day" + i + "-name").html(shortDayNames[$("#day" + i + "-name").text()]);
                $("#seven-day" + i + "-summary").attr("style", "display: none");
                $("#seven-day" + i + "-temp-detail").attr("style", "display: none");
                $("#seven-day" + i + "-icon").attr("style", "display: none");
            } else {
                $("#day" + i).animate({
                    height: "114px",
                    width: "100%"
                }, 200);
                $("#day" + i + "-content").removeAttr("class");
                $("#day" + i + "-content").animate({
                    fontSize: "32px",
                    position: "static",
                    top: "auto",
                    transform: "none"
                }, 200);
                $("#day" + i + "-name").css("font-size", "20px");
                $("#day" + i + "-name").html(fullDayNames[$("#day" + i + "-name").text()]);
                $("#seven-day" + i + "-summary").removeAttr("style");
                $("#seven-day" + i + "-temp-detail").removeAttr("style");
                $("#seven-day" + i + "-icon").removeAttr("style");
            }
        }

    });
}

var fullDayNames = {
    "Su": "Sunday",
    "M": "Monday",
    "Tu": "Tuesday",
    "W": "Wednesday",
    "Th": "Thursday",
    "F": "Friday",
    "Sa": "Saturday"
}

var shortDayNames = {
    "Sunday": "Su",
    "Monday": "M",
    "Tuesday": "Tu",
    "Wednesday": "W",
    "Thursday": "Th",
    "Friday": "F",
    "Saturday": "Sa"
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