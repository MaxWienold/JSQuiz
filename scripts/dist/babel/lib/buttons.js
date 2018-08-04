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
