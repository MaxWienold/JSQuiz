(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    var answersValue = Number(document.getElementById('answerfield').answers.value);
    // answersValue = Number(answersValue);
    console.log(answersValue);
    _pubsub2.default.emit('answerChosen', answersValue);
  }
}();

},{"./pubsub.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  events: {},

  // publish
  emit: function emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  },

  // subscribe
  subscribe: function subscribe(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
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

},{}]},{},[1]);
