(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1]);
