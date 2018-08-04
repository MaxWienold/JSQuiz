(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _questions = require('./lib/questions');

var _questions2 = _interopRequireDefault(_questions);

var _answers = require('./lib/answers');

var _answers2 = _interopRequireDefault(_answers);

var _buttons = require('./lib/buttons');

var _buttons2 = _interopRequireDefault(_buttons);

var _result = require('./lib/result');

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startQuiz(args) {
  _questions2.default.init();
}
window.onload = function () {
  startQuiz();
};

// pubSub.console.log('from index');
// quiz.startQuiz();

},{"./lib/answers":2,"./lib/buttons":3,"./lib/questions":5,"./lib/result":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var questContainer = document.querySelector('.question-container');

  var classToggle = 'questionTile-nxt';
  var start = true;

  _pubsub2.default.subscribe('nextQuestion', function classNameNxt() {
    classToggle = 'questionTile-nxt';
  });

  _pubsub2.default.subscribe('prevQuestion', function classNamePrv() {
    classToggle = 'questionTile-prv';
  });

  _pubsub2.default.subscribe('questionSent', function renderQuestion(questObj) {
    try {
      answerForm.removeEventListener('change', eventAnswerChosen, false);
    } catch (e) {} finally {};
    // assigning class names to trigger CSS-transitions
    var toggleOpp = 'questionTile-prv';
    if (classToggle == 'questionTile-prv') {
      toggleOpp = 'questionTile-nxt';
    }

    if (!start || classToggle == 'questionTile-prv') {
      questContainer.firstElementChild.classList.toggle(toggleOpp);
    }
    // New container for question and answer form
    var questionTile = document.createElement('div');
    questionTile.className = 'questionTile questionTile-transition ' + classToggle;
    var questText = document.createElement('h2');

    questionTile.appendChild(questText);
    var answerForm = document.createElement('form');
    answerForm.className = 'answerfield';
    answerForm.id = 'answerfield';

    questText.innerHTML = questObj.question;

    // answer form

    questObj.answers.forEach(function (answer, i) {
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'answers';
      radio.id = 'ans' + i;
      radio.value = i;
      radio.name = 'answers';
      if ('answered' in questObj) {
        if (questObj.answered == i) {
          radio.checked = true;
        }
      };
      var label = document.createElement('label');
      label.setAttribute('for', 'ans' + i);
      label.innerHTML = answer.text;
      answerForm.appendChild(radio);
      answerForm.appendChild(label);
    });
    // Insert new question element into DOM.
    setTimeout(function () {
      try {
        questContainer.removeChild(questContainer.firstElementChild);
      } catch (e) {};
      questionTile.appendChild(answerForm);
      questContainer.appendChild(questionTile);

      setTimeout(function () {
        questContainer.firstElementChild.className = 'questionTile questionTile-transition';
        start = false;
      }, 400);
    }, 500);

    answerForm.addEventListener('change', answerChosen, false);
  });

  function answerChosen() {
    console.log('answer chosen, alright!');
    var answersValue = Number(document.getElementById('answerfield').answers.value);
    // answersValue = Number(answersValue);
    _pubsub2.default.emit('answerChosen', answersValue);
  }
}();

},{"./pubsub.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var btnNext = document.getElementById('next');
  var btnPrev = document.getElementById('prev');

  btnNext.addEventListener('click', _nextQuestion);
  btnPrev.addEventListener('click', _prevQuestion);

  /*
    CHANGING OF BUTTONS' TEXTS
  */
  _pubsub2.default.subscribe('firstQuestion', function _noPrevButton() {

    btnPrev.style.visibility = 'hidden';
  });

  _pubsub2.default.subscribe('lastQuestion', function _btnEndQuiz() {
    btnNext.innerHTML = 'Quiz beenden';
  });

  _pubsub2.default.subscribe('questionSent', function _normalQuestion(question) {
    btnPrev.style.visibility = 'initial';
    btnNext.innerHTML = 'nächste Frage';
    btnNext.disabled = true;
    if ('answered' in question) {
      // was the question answered before?
      btnNext.disabled = false;
    }
  });

  _pubsub2.default.subscribe('answerChosen', _changeNextBtn);

  function _changeNextBtn() {
    // enable button when radio clicked
    btnNext.disabled = false;
  };

  function _nextQuestion() {
    _pubsub2.default.emit('nextQuestion');
  };

  function _prevQuestion() {
    _pubsub2.default.emit('prevQuestion');
  };

  function destroy() {
    btnNext.removeEventListener('click', _nextQuestion);
    btnPrev.removeEventListener('click', _prevQuestion);
  }
  return {
    destroy: destroy
  };
}();

},{"./pubsub.js":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var questArr = [{
    'question': 'Was ist der Sinn des Lebens?',
    'answers': [{
      'text': '42',
      'isCorrect': true
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }]
  }, {
    'question': 'Frage 2',
    'answers': [{
      'text': 'Richtig',
      'isCorrect': true
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }]
  }, {
    'question': 'Frage 3',
    'answers': [{
      'text': 'Richtig',
      'isCorrect': true
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }]
  }, {
    'question': 'Frage 4',
    'answers': [{
      'text': 'Richtig',
      'isCorrect': true
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }, {
      'text': 'Falsch',
      'isCorrect': false
    }]
  }];

  var indexTracker = 0;
  _randomizeArray(questArr);

  _pubsub2.default.subscribe('prevQuestion', function sndPrvQstn() {
    indexTracker--;
    _sendQuestion();
  });
  _pubsub2.default.subscribe('nextQuestion', function sndNxtQstn() {
    indexTracker++;
    _sendQuestion();
  });

  _pubsub2.default.subscribe('answerChosen', function saveAnswer(data) {
    questArr[indexTracker].answered = data;
  });

  function _sendQuestion() {
    if (indexTracker == questArr.length) {
      _pubsub2.default.emit('finishQuiz', questArr);
    } else {
      _pubsub2.default.emit('questionSent', questArr[indexTracker]);
      if (indexTracker == 0) {
        _pubsub2.default.emit('firstQuestion', '');
      } else if (indexTracker == questArr.length - 1) {
        _pubsub2.default.emit('lastQuestion', '');
      }
    }
  }

  function init(args) {
    _sendQuestion();
  };

  function _randomizeArray(arr) {
    var array = arr;
    for (var i = 0; i < array.length; i++) {
      var randIndex = Math.floor(Math.random() * array.length);
      var tmp = array[i];
      array[i] = array[randIndex];
      array[randIndex] = tmp;
      if (array[randIndex].answers) {
        _randomizeArray(array[randIndex].answers);
      }
    };
  };

  return {
    init: init
  };
}();

},{"./pubsub.js":4}],6:[function(require,module,exports){
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

},{"./pubsub.js":4}]},{},[1]);
