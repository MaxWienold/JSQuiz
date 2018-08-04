'use strict';

import pubSub from './pubsub.js';

export default (() => {
  pubSub.subscribe('finishQuiz',
  function renderResult(resultArr) {
    let container = document.getElementById('quizcontainer');
    let questionsTotal = resultArr.length;
    let rightQuestions = resultArr.reduce((value, item) => {
      if (item.answers[item.answered].isCorrect) {
        return ++value;
      } else {
        return value;
      }
    }, 0);

    let percent = Number(
      (rightQuestions / questionsTotal) * 100)
        .toFixed(0);
    let message = getMessage(percent);


    let resMessage = document.createElement('div');

    resMessage.innerHTML = message + '</br>Du hast ' + percent +
    '% richtig beantwortet.';
    resMessage.className = 'result';
    animateUp(quizcontainer, resMessage, 50, 100);
  });

  function animateUp(element, toRender, time, value) {
    try {
      element.style.position = 'absolute';
      let start = null;
      let step = value / time;
      let top = element.style.top;

      window.requestAnimationFrame(_up);

      function _up(timestamp) {
        if (!start) {
          start = timestamp;
        };

          //
          element.style.top = (top - step) + '%';
          top = (top - step);
        if (Math.abs(top) <= (value - 3)) {
          window.requestAnimationFrame(_up);
        } else {
          window.cancelAnimationFrame(_up);
          start = null;
          step *= 2;
          while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
          }
          element.appendChild(toRender);

          window.requestAnimationFrame(_down);
        }
      };


      function _down(timestamp) {
        if (!start) start = timestamp;


          element.style.top = (top + step) + '%';
          top += step;

        if (top <= 0) {
          window.requestAnimationFrame(_down);
        } else {
          window.cancelAnimationFrame(_down);
        }
      }
    } catch (e) {

    }
  };


  function getMessage(num) {
    let message = '';
    if (num == 100) {
      message = 'Super, Du bist wirklich ein Experte!';
    } else if (num >= 75) {
      message = 'Ziemlich gut, aber da geht noch was!';
    } else if (num >= 50) {
      message = 'Du kannst sicher noch etwas lernen!';
    } else if (num >= 25) {
      message = 'Hmmm, na ja...';
    } else {
        message = 'Ganz schön grottig, mein junger Padawan!';
      }
      return message;
  }
})();
