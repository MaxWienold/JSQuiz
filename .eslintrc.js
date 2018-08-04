module.exports = {
  "extends": "google",
  "env": {
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "require-jsdoc": ["error", {
        "require": {
            "FunctionDeclaration": false,
            "MethodDefinition": false,
            "ClassDeclaration": false,
            "ArrowFunctionExpression": false,
            "FunctionExpression": false
        }
    }]
  }



};
