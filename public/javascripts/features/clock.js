var bar1;
var rangeValLabel;
var typeSelect;
var slider;
var secondsLabel;
var initialTime, currTime, percentage;
var timer;

var endTime;

var hours, minutes, seconds;

rangeValLabel = document.getElementById("rangeValLabel");
typeSelect = document.getElementById("typeForm");
slider = document.getElementById('slider');
secondsLabel = document.getElementById('currentTime');
rangeValLabel.innerHTML = slider.value;

function onClick() {
    if (!bar1) {
        bar1 = ldBar("#myItem1");
    }
    clearInterval(timer);
    var selected;

    for (i = 0; i < typeSelect.length; i++) {
        if (typeSelect[i].checked) {
            selected = i;
        }
    }
    if (selected == 0) {
        endTime = slider.value * 60;
    }
    else {
        endTime = slider.value;
    }

    currTime = 0;

    distance = endTime - currTime;

    hours = Math.floor((distance / 3600));
    distance = (distance % 3600);
    minutes = Math.floor((distance / 60));
    distance = (distance % 60);
    seconds = Math.floor((distance));

    secondsLabel.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    percentage = (endTime / endTime) * 100;
    bar1.set(percentage);

    timer = setInterval(function () {
        currTime++;


        distance = endTime - currTime;
        hours = Math.floor((distance / 3600));
        distance = (distance % 3600);
        minutes = Math.floor((distance / 60));
        distance = (distance % 60);
        seconds = Math.floor((distance));

        if (currTime == endTime) {
            clearInterval(timer);
            alert("Time Up!");
            secondsLabel.innerHTML = "Time Up!";
            bar1.set(0);
        }
        else {
            var newPercentage = (1 - (currTime / endTime)) * 100;
            bar1.set(newPercentage);
            secondsLabel.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

function stop() {
    if (!bar1) {
        bar1 = ldBar("#myItem1");
    }
    clearInterval(timer);
    secondsLabel.innerHTML = "0h 0m 0s";
    bar1.set(0);
}

function showTimer(trigger) {
    var pomodoroTimer = document.getElementById("pomodoroTimer");
    if (trigger) {
        pomodoroTimer.style.display = "block";
    } else {
        pomodoroTimer.style.display = "none";
    }
}
