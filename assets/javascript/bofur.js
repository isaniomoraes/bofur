(function () {
  'use strict';
  const notifier = require('node-notifier');
  const path = require('path');

  window.onload = function() {
    var timer = null;
    var minutes = 5;
    var seconds = 0;
    var lastValue = minutes;
    var statusTimer = false;
    var slider = document.querySelector('.slider');
    var btnStart = document.querySelector('.btn-start');
    var timerDisplay = document.querySelector('.timer-display label');
    var minutesLabel = document.querySelector('.minutes-label');

    slider.addEventListener('input', function(){
      minutes = this.value;
      timeDisplay();
    });

    btnStart.addEventListener('click', function() {
      if(!statusTimer) {
        statusTimer = true;
        slider.style.opacity = .4;
        slider.setAttribute("disabled", "disabled");

        lastValue = minutes;

        seconds = 0;
        timerControl();
      } else {
        dataReset();
      }

      btnStart.innerHTML = !statusTimer ? 'Start' : 'Stop';
    });

    function handleTimer() {
      timer = setTimeout(function () {
        timerControl();
      }, 1000);
    }

    function timerControl() {
      if(seconds === 0) {
        minutes--;
        seconds = 60;
      } else {
        seconds--;
      }

      if(minutes === 0 && seconds === 0) {
        dataReset();

        notifier.notify({
          title: 'Bofur',
          message: "Completed!",
          sound: true,
          icon: path.join(__dirname, 'assets/images/stopwatch@2x.png'),
        });
      } else {
        handleTimer();
      }

      timeDisplay();
    }

    function timeDisplay() {
      var _minutes = minutes < 10 ? "0" + minutes : minutes;
      var _seconds = seconds < 10 ? "0" + seconds : seconds;

      timerDisplay.innerHTML = _minutes + ":" + _seconds;

      if(minutes >= 2)
        minutesLabel.innerHTML = 'minutes';
      else
        minutesLabel.innerHTML = 'minute';
    }

    function dataReset() {
      statusTimer = false;

      if(timer) window.clearTimeout(timer);

      seconds = 0;
      minutes = lastValue;
      btnStart.innerHTML = 'Start';

      slider.style.opacity = 1;
      slider.value = lastValue;
      slider.removeAttribute("disabled");

      timeDisplay();
    }

    dataReset();
  };

})();
