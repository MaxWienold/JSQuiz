(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pubsub = require('./pubsub.js');

var _pubsub2 = _interopRequireDefault(_pubsub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var questTracker = 0;

  var btnNext = document.getElementById('next');
  var btnPrev = document.getElementById('prev');

  btnNext.addEventListener('click', nextQuestion);
  btnPrev.addEventListener('click', prevQuestion);

  _pubsub2.default.subscribe('firstQuestion', function noPrevButton() {
    btnPrev.style.visibility = 'hidden';
  });

  _pubsub2.default.subscribe('lastQuestion', function btnEndQuiz() {
    btnNext.innerHTML = 'Quiz beenden';
  });

  _pubsub2.default.subscribe('questionSent', function normalQuestion(question) {
    btnPrev.style.visibility = 'initial';
    btnNext.innerHTML = 'nächste Frage';
    btnNext.disabled = true;
    if ('answered' in question) {
      btnNext.disabled = false;
    }
  });
  var changeNextBtn = function changeNextBtn() {
    btnNext.disabled = false;
  };

  _pubsub2.default.subscribe('answerChosen', changeNextBtn);

  function nextQuestion() {
    questTracker++;

    _pubsub2.default.emit('nextQuestion', questTracker);
    _pubsub2.default.emit('updateQuestion', questTracker);
  };

  function prevQuestion() {
    questTracker--;
    _pubsub2.default.emit('prevQuestion', questTracker);
    _pubsub2.default.emit('updateQuestion', questTracker);
  };

  function destroy() {
    btnNext.removeEventListener('click', nextQuestion);
    btnPrev.removeEventListener('click', prevQuestion);
  }
  return {
    destroy: destroy
  };
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
