(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  events: {},

  // publish
  emit: function emit(eventName, data) {
    if (this.events[eventName]) {
      console.log(this.events[eventName]);
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  },

  // subscribe
  subscribe: function subscribe(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
    console.log(this.events);
  },

  // unsubscribe
  unsubscribe: function unsubscribe(eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(function (item) {
        return item.name !== fn.name;
      });
    }
  }

};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _pubsub2.default.subscribe('finishQuiz', function renderResult(resultArr) {
    var container = document.getElementById('quizcontainer');
    var questionsTotal = resultArr.length;
    var rightQuestions = resultArr.reduce(function (value, item) {
      if (item.answers[item.answered].isCorrect) {
        return ++value;
      } else {
        return value;
      }
    }, 0);

    var percent = Number(rightQuestions / questionsTotal * 100).toFixed(0);
    var message = getMessage(percent);

    var resMessage = document.createElement('div');

    resMessage.innerHTML = message + '</br>Du hast ' + percent + '% richtig beantwortet.';
    resMessage.className = 'result';
    animateUp(quizcontainer, resMessage, 50, 100);
  });

  function animateUp(element, toRender, time, value) {
    try {
      var _up = function _up(timestamp) {
        if (!start) {
          start = timestamp;
        };

        //
        element.style.top = top - step + '%';
        top = top - step;
        if (Math.abs(top) <= value - 3) {
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

      var _down = function _down(timestamp) {
        if (!start) start = timestamp;

        element.style.top = top + step + '%';
        top += step;

        if (top <= 0) {
          window.requestAnimationFrame(_down);
        } else {
          window.cancelAnimationFrame(_down);
        }
      };

      element.style.position = 'absolute';
      var start = null;
      var step = value / time;
      var top = element.style.top;

      window.requestAnimationFrame(_up);

      ;
    } catch (e) {}
  };

  function getMessage(num) {
    var message = '';
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
}();

},{"./pubsub.js":1}]},{},[2]);
