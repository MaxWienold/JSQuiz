'use strict';
import pubSub from './pubsub.js';

export default (() => {
  let btnNext = document.getElementById('next');
  let btnPrev = document.getElementById('prev');

  btnNext.addEventListener('click', _nextQuestion);
  btnPrev.addEventListener('click', _prevQuestion);

/*
  CHANGING OF BUTTONS' TEXTS
*/
  pubSub.subscribe('firstQuestion', function _noPrevButton() {

    btnPrev.style.visibility = 'hidden';
  });

  pubSub.subscribe('lastQuestion', function _btnEndQuiz() {
    btnNext.innerHTML = 'Quiz beenden';
  });

  pubSub.subscribe('questionSent', function _normalQuestion(question) {
    btnPrev.style.visibility = 'initial';
    btnNext.innerHTML = 'nächste Frage';
    btnNext.disabled = true;
    if ('answered' in question) { // was the question answered before?
      btnNext.disabled = false;
    }
  });

  pubSub.subscribe('answerChosen', _changeNextBtn);

  function _changeNextBtn() { // enable button when radio clicked
      btnNext.disabled = false;
  };

  function _nextQuestion() {
      pubSub.emit('nextQuestion');
  };

  function _prevQuestion() {
      pubSub.emit('prevQuestion');
  };

  function destroy() {
    btnNext.removeEventListener('click', _nextQuestion);
    btnPrev.removeEventListener('click', _prevQuestion);
  }
  return {
    destroy: destroy,
  };
})();
