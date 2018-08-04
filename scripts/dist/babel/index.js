'use strict';

var _questions = require('./lib/questions');

var _questions2 = _interopRequireDefault(_questions);

var _answers = require('./lib/answers');

var _answers2 = _interopRequireDefault(_answers);

var _buttons = require('./lib/buttons');

var _buttons2 = _interopRequireDefault(_buttons);

var _result = require('./lib/result');

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startQuiz(args) {
  _questions2.default.init();
}
window.onload = function () {
  startQuiz();
};

// pubSub.console.log('from index');
// quiz.startQuiz();
