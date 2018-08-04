'use strict';
import pubSub from './pubsub.js';

export default (() => {
  let questContainer = document.querySelector('.question-container');

  let classToggle = 'questionTile-nxt';
  let start = true;

  pubSub.subscribe('nextQuestion', function classNameNxt() {
    classToggle = 'questionTile-nxt';
  });

  pubSub.subscribe('prevQuestion', function classNamePrv() {
    classToggle = 'questionTile-prv';
  });


  pubSub.subscribe('questionSent', function renderQuestion(questObj) {
    try {
      answerForm.removeEventListener('change', eventAnswerChosen, false );
    } catch (e) {

    } finally {

    };
    // assigning class names to trigger CSS-transitions
    let toggleOpp = 'questionTile-prv';
    if (classToggle == 'questionTile-prv') {
      toggleOpp = 'questionTile-nxt';
    }

    if (!start || classToggle == 'questionTile-prv') {
      questContainer.firstElementChild.classList
      .toggle(toggleOpp);
    }
    // New container for question and answer form
    let questionTile = document.createElement('div');
    questionTile.className =
    'questionTile questionTile-transition '+ classToggle;
    let questText = document.createElement('h2');

    questionTile.appendChild(questText);
    let answerForm = document.createElement('form');
    answerForm.className = 'answerfield';
    answerForm.id = 'answerfield';

    questText.innerHTML = questObj.question;

    // answer form

    questObj.answers.forEach((answer, i) => {
      let radio = document.createElement('input');
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
      let label = document.createElement('label');
      label.setAttribute('for', ('ans' + i));
      label.innerHTML = answer.text;
      answerForm.appendChild(radio);
      answerForm.appendChild(label);
    });
    // Insert new question element into DOM.
    setTimeout(function() {
     try {
        questContainer.removeChild(questContainer.firstElementChild);
      } catch (e) { };
      questionTile.appendChild(answerForm);
      questContainer.appendChild(questionTile);

      setTimeout(function() {
        questContainer.firstElementChild.className =
        'questionTile questionTile-transition';
        start = false;
      }, 400);
    }, 500);

    answerForm.addEventListener('change', answerChosen, false );
  });


  function answerChosen() {
    console.log('answer chosen, alright!');
    let answersValue =
    Number(document.getElementById('answerfield').answers.value);
    // answersValue = Number(answersValue);
    pubSub.emit('answerChosen', answersValue);
  }
})();
