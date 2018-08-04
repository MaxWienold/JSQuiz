
import questions from './lib/questions';
import answers from './lib/answers';
import buttons from './lib/buttons';
import result from './lib/result';
function startQuiz(args) {
  questions.init();
}
window.onload = function() {
  startQuiz();
};


// pubSub.console.log('from index');
 // quiz.startQuiz();
