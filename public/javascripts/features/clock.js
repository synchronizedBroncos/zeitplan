var bar1 = new ldBar("#myItem1");
var rangeValLabel = document.getElementById("rangeValLabel");
var typeSelect = document.getElementById("typeForm")
var slider = document.getElementById('slider');
var secondsLabel = document.getElementById('currentTime');
var initialTime, currTime, percentage;
var timer;

var endTime;

var hours, minutes, seconds;

rangeValLabel.innerHTML = slider.value;

function onClick(){
    clearInterval(timer);
    var selected;

    for (i = 0; i < typeSelect.length; i++) {
        if (typeSelect[i].checked) {
            selected = i;
        }
    }
    if(selected == 0){
        endTime = slider.value * 60;
    }
    else{
        endTime = slider.value;
    }

    currTime = 0;

    distance = endTime - currTime;

    hours = Math.floor((distance / 3600));
    distance = (distance % 3600);
    minutes = Math.floor((distance / 60));
    distance = (distance % 60);
    seconds = Math.floor((distance));

    secondsLabel.innerHTML = hours + "h "+ minutes + "m " + seconds + "s ";
    percentage = (endTime / endTime) * 100;
    bar1.set(percentage);

    timer = setInterval(function() { 
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
        else{
          var newPercentage = (1 - (currTime/endTime)) * 100;
          bar1.set(newPercentage);
          secondsLabel.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
        }
      }, 1000);


}






