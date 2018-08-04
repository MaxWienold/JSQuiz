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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var indexTracker = 0;

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

  _randomizeArray(questArr);

  function init(args) {
    _pubsub2.default.emit('questionSent', questArr[0]);
    _pubsub2.default.emit('firstQuestion', '');
  };
  _pubsub2.default.subscribe('updateQuestion', function sendQuestion(index) {
    indexTracker = index;
    if (index == questArr.length) {
      _pubsub2.default.emit('finishQuiz', questArr);
    } else {
      _pubsub2.default.emit('questionSent', questArr[index]);
      if (index == 0) {
        _pubsub2.default.emit('firstQuestion', '');
      } else if (index == questArr.length - 1) {
        _pubsub2.default.emit('lastQuestion', '');
      }
    }
  });

  _pubsub2.default.subscribe('answerChosen', function saveAnswer(data) {
    questArr[indexTracker].answered = data;
  });

  function _randomizeArray(arr) {
    var array = arr;
    for (var i = 0; i < array.length; i++) {
      var randIndex = Math.floor(Math.random() * array.length);
      var tmp = array[i];
      array[i] = array[randIndex];
      array[randIndex] = tmp;
      if (array[randIndex].answers) {
        console.log('bedingung erfüllt.');
        _randomizeArray(array[randIndex].answers);
      }
    };
    return array;
  };

  return {
    init: init
  };
}();

},{"./pubsub.js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _questions = require('./questions.js');

var _questions2 = _interopRequireDefault(_questions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import pubSub from './pubsub.js';


/*
on start of a new quiz
- initialize questions array.
- initialize index tracker with 0.
- insert question and answers to the DOM.
- listen to change, when occured, set button to active
- when button is clicked.
- increase indextracker
- check answer.
*/

exports.default = function () {
  var currQuestIndex = 0;
  var questArray = (0, _questions2.default)();
  var currQuest = questArray[currQuestIndex];

  var questContainer = document.querySelector('.question-container');
  var btnNext = document.getElementById('next');
  var btnPrev = document.getElementById('prev');
  var parent = document.getElementById('quizcontainer');
  var answers = void 0;
  var answersValue = void 0;

  btnNext.addEventListener('click', eventNxtQuestion, false);

  btnPrev.addEventListener('click', eventPrvQuestion, false);

  function eventPrvQuestion() {
    if (currQuestIndex >= questArray.length - 1) {
      btnNext.removeEventListener('click', eventResult, false);
      btnNext.addEventListener('click', eventNxtQuestion, false);
    }
    --currQuestIndex;
    currQuest = questArray[currQuestIndex];

    renderQuestion(currQuest, questContainer, 'questionTile-prv');
  };

  function eventNxtQuestion() {
    questArray[currQuestIndex].answered = Number(answersValue.value);
    // answers = document.getElementById('answerfield').answers;
    console.log(answersValue.value);

    ++currQuestIndex;
    currQuest = questArray[currQuestIndex];
    renderQuestion(currQuest, questContainer, 'questionTile-nxt');
  };

  function eventAnswerChosen() {
    if (btnNext.disabled) {
      btnNext.disabled = false;
    }
  }

  function startQuiz() {
    // console.log(pubSub);
    // pubSub.say('blaba');
    currQuestIndex = 0;
    questArray = _randomizeArray((0, _questions2.default)());
    questArray.forEach(function (quest) {
      var answers = _randomizeArray(quest.answers);
      quest.answers = answers;
    });
    currQuest = questArray[currQuestIndex];
    renderQuestion(currQuest, questContainer, 'questionTile-nxt');
  }

  function renderQuestion(questObj, parentNode) {
    try {
      answerForm.removeEventListener('change', eventAnswerChosen, false);
    } catch (e) {} finally {};

    // assigning class names to trigger CSS-transitions
    var toggleOpp = 'questionTile-prv';
    if (classToggle == 'questionTile-prv') {
      toggleOpp = 'questionTile-nxt';
    }

    if (currQuestIndex > 0 || classToggle == 'questionTile-prv') {
      parentNode.firstElementChild.classList.toggle(toggleOpp);
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
      if ('answered' in currQuest) {
        if (currQuest.answered == i) {
          console.log('true');
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
      if (currQuestIndex > 0 || classToggle == 'questionTile-prv') {
        parentNode.removeChild(parentNode.firstElementChild);
      }
      questionTile.appendChild(answerForm);
      parentNode.appendChild(questionTile);
      answersValue = document.getElementById('answerfield').answers;
      setTimeout(function () {
        parentNode.firstElementChild.className = 'questionTile questionTile-transition';
      }, 400);
    }, 500);

    answerForm.addEventListener('change', eventAnswerChosen, false);

    renderButtons();
  };

  function renderButtons() {
    console.log(questArray.length - 1);
    if (currQuestIndex == 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = 'inline-block';
    }
    if ('answered' in currQuest) {
      btnNext.disabled = false;
    } else {
      btnNext.disabled = true;
    }
    if (currQuestIndex == questArray.length - 1) {
      btnNext.innerHTML = 'Quiz beenden';
      btnNext.addEventListener('click', eventResult, false);
      btnNext.removeEventListener('click', eventNxtQuestion, false);
    } else {
      btnNext.innerHTML = 'nächste Frage';
    }
  }

  function eventResult() {
    var x = 0;
    function animate() {
      // x = 50;
      if (x > -100) {
        console.log(x);
        requestAnimationFrame(animate);
        parent.style.top = '' + x + 'vh';
        x -= 5;
      } else {
        cancelAnimationFrame(animate);
        console.log('foo');
      }
    }
    animate();
    _clearElement(parent);

    // render the results
    questArray.forEach(function (item) {
      console.log(item);
      var answer = document.createElement('div');
      if (item.answers[item.answered].isCorrect) {
        answer.classList.add('result-answer', 'result-answer-correct');
      } else {
        answer.classList.add('result-answer', 'result-answer-false');
      }
      answer.innerHTML = item.question;
      parent.appendChild(answer);
    });

    function animateDown() {
      if (x < 0) {
        console.log(x);
        requestAnimationFrame(animateDown);
        parent.style.top = '' + x + 'vh';
        x += 5;
      } else {
        cancelAnimationFrame(animateDown);
        console.log('foo');
      }
    }
    animateDown();
  };

  function _randomizeArray(arr) {
    var array = arr;
    for (var i = 0; i < array.length; i++) {
      var randIndex = Math.floor(Math.random() * array.length);
      var tmp = array[i];
      array[i] = array[randIndex];
      array[randIndex] = tmp;
    };
    return array;
  };

  function _clearElement(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  return {
    startQuiz: startQuiz
  };
}();

},{"./questions.js":2}]},{},[3]);
