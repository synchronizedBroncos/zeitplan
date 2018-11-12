var bar1 = new ldBar("#myItem1");
var rangeValLabel = document.getElementById("rangeValLabel");
var typeSelect = document.getElementById("typeForm")
var slider = document.getElementById('slider');
var secondsLabel = document.getElementById('currentTime');
var initialTime, currTime, percentage;
var timer;

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
        initialTime = slider.value * 60;
    }
    else{
        initialTime = slider.value;
    }

    //initially set timer
    currTime = initialTime;
    secondsLabel.innerHTML = String(currTime) + " seconds";
    percentage = (currTime / initialTime) * 100;
    bar1.set(percentage);

    timer = setInterval(function() { 
      currTime--;
         
        if (currTime < 0) {
          clearInterval(timer);
          alert("Time Up!");
          secondsLabel.innerHTML = "Time Up!";
        }
        else{
          var newPercentage = (currTime/initialTime) * 100;
          bar1.set(newPercentage);
          secondsLabel.innerHTML = String(currTime) + " seconds";
        }
      }, 1000);


}






