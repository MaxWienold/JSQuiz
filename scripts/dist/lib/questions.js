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

},{"./pubsub.js":1}]},{},[2]);
