'use strict';
import questions from './questions.js';


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

export default (() => {
  let currQuestIndex = 0;
  let questArray = questions();
  let currQuest = questArray[currQuestIndex];


  let questContainer = document.querySelector('.question-container');
  let btnNext = document.getElementById('next');
  let btnPrev = document.getElementById('prev');
  let parent = document.getElementById('quizcontainer');
  let answers;
  let answersValue;

  btnNext.addEventListener('click', eventNxtQuestion, false);

  btnPrev.addEventListener('click', eventPrvQuestion, false);

  function eventPrvQuestion() {
    if (currQuestIndex >= questArray.length -1) {
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
    renderQuestion(currQuest, questContainer,
      'questionTile-nxt');
    };

    function eventAnswerChosen() {
      if (btnNext.disabled) {
        btnNext.disabled = false;
      }
    }

    function startQuiz() {
      currQuestIndex = 0;
      questArray = _randomizeArray(questions());
      questArray.forEach((quest) => {
        let answers = _randomizeArray(quest.answers);
        quest.answers = answers;
      });
      currQuest = questArray[currQuestIndex];
      renderQuestion(currQuest, questContainer, 'questionTile-nxt');
    }

    function renderQuestion(questObj, parentNode, classToggle) {
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

      if (currQuestIndex > 0 || classToggle == 'questionTile-prv') {
        parentNode.firstElementChild.classList
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
        if ('answered' in currQuest) {
          if (currQuest.answered == i) {
            console.log('true');
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
        if (currQuestIndex > 0 || classToggle == 'questionTile-prv') {
          parentNode.removeChild(parentNode.firstElementChild);
        }
        questionTile.appendChild(answerForm);
        parentNode.appendChild(questionTile);
        answersValue = document.getElementById('answerfield').answers;
        setTimeout(function() {
          parentNode.firstElementChild.className =
          'questionTile questionTile-transition';
        }, 400);
      }, 500);

      answerForm.addEventListener('change', eventAnswerChosen, false );

      renderButtons();
    };

    function renderButtons() {
      console.log(questArray.length-1);
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
      if (currQuestIndex == questArray.length-1 ) {
        btnNext.innerHTML = 'Quiz beenden';
        btnNext.addEventListener('click', eventResult, false);
        btnNext.removeEventListener('click', eventNxtQuestion, false);
      } else {
        btnNext.innerHTML = 'nächste Frage';
      }
    }

    function eventResult() {
      let x = 0;
      function animate() {
        // x = 50;
        if (x > -100) {
          console.log(x);
          requestAnimationFrame(animate);
          parent.style.top = '' + x + 'vh';
          x-= 5;
        } else {
          cancelAnimationFrame(animate);
          console.log('foo');
        }
      }
      animate();
      _clearElement(parent);
      // render the results
      questArray.forEach((item) => {
        console.log(item);
        let answer = document.createElement('div');
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
          x+= 5;
        } else {
          cancelAnimationFrame(animateDown);
          console.log('foo');
        }
      }
      animateDown();
    };

    function _randomizeArray(arr) {
      let array = arr;
      for (let i = 0; i < array.length; i++) {
        let randIndex = Math.floor(Math.random() * array.length);
        let tmp = array[i];
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
      startQuiz: startQuiz,
    };
  })();
