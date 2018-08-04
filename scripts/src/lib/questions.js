'use strict';
import pubSub from './pubsub.js';


export default (function() {
  let questArr = [
    {
      'question': 'Was ist der Sinn des Lebens?',
      'answers': [
        {
          'text': '42',
          'isCorrect': true,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
      ],
    },
    {
      'question': 'Frage 2',
      'answers': [
        {
          'text': 'Richtig',
          'isCorrect': true,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
      ],
    },
    {
      'question': 'Frage 3',
      'answers': [
        {
          'text': 'Richtig',
          'isCorrect': true,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },

      ],
    },
    {
      'question': 'Frage 4',
      'answers': [
        {
          'text': 'Richtig',
          'isCorrect': true,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },
        {
          'text': 'Falsch',
          'isCorrect': false,
        },

      ],
    },
  ];

let indexTracker = 0;
_randomizeArray(questArr);


pubSub.subscribe('prevQuestion', function sndPrvQstn() {
  indexTracker--;
  _sendQuestion();
}
);
  pubSub.subscribe('nextQuestion', function sndNxtQstn() {
    indexTracker++;
    _sendQuestion();
  }
);

pubSub.subscribe('answerChosen',
  function saveAnswer(data) {
    questArr[indexTracker].answered = data;
  });

  function _sendQuestion() {
      if (indexTracker == questArr.length) {
        pubSub.emit('finishQuiz', questArr);
      } else {
        pubSub.emit('questionSent', questArr[indexTracker]);
        if (indexTracker == 0) {
          pubSub.emit('firstQuestion', '');
        } else if (indexTracker == questArr.length - 1) {
          pubSub.emit('lastQuestion', '');
      }
    }
}

function init(args) {
  _sendQuestion();
};

function _randomizeArray(arr) {
  let array = arr;
  for (let i = 0; i < array.length; i++) {
    let randIndex = Math.floor(Math.random() * array.length);
    let tmp = array[i];
    array[i] = array[randIndex];
    array[randIndex] = tmp;
    if (array[randIndex].answers) {
      _randomizeArray(array[randIndex].answers);
    }
  };
};

return {
  init: init,
};
})();
