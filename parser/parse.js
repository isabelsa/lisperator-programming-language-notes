/*
 * (1.3) Parser: PARSING
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This will operate on the stream tokens (e.g: if) generated by the lexer(e.g: i,f), establishing programs,
 * turnining it into an AST the structural representation of the program.
 * This kind of parser is called a “recursive descent parser”. All these functions are “mutually recursive”.
 *
 */

module.exports = function Parser(input) {
  var FALSE = { type: "bool", value: false };

  var PRECEDENCE = {
    "=": 1,
    "||": 2,
    "&&": 3,
    "<": 7,
    ">": 7,
    "<=": 7,
    ">=": 7,
    "==": 7,
    "!=": 7,
    "+": 10,
    "-": 10,
    "*": 20,
    "/": 20,
    "%": 20,
  };

  return parseTopLevel();

  // * ------------------------------------------------------
  // All parsing functions
  function parseTopLevel() {
    var program = [];
    while (!input.eof()) {
      program.push(parseExpression());
      if (!input.eof()) {
        skipPunctuation(";");
      }
    }

    return { type: "prog", prog: program };
  }

  function parseAtom() {
    return maybeCall(function () {
      if (isPunctuation("(")) {
        input.next();
        var exp = parseExpression();
        skipPunctuation(")");
        return exp;
      }

      if (isPunctuation("{")) return parseProgram();
      if (isKeyword("if")) return parseIf();
      if (isKeyword("true") || isKeyword("false")) return parseBoolean();
      if (isKeyword("lambda" || isKeyword("λ"))) {
        input.next();
        return parseLambda();
      }

      var token = input.next();
      if (token.type == "var" || token.type == "num" || token.type == "str") {
        return token;
      }

      unexpected();
    });
  }

  function parseExpression() {
    return maybeCall(function () {
      return maybeBinary(parseAtom(), 0);
    });
  }

  function parseProgram() {
    var program = argumentDelimitor("{", "}", ";", parseExpression);
    if (program.length == 0) return FALSE;
    if (program.length == 1) return program[0];

    console.log("In parser:", program);
    return { type: "prog", prog: program };
  }

  function parseVarName() {
    var name = input.next();
    if (name.type != "var") {
      input.croak("Expecting variable name");
    }
    return name.value;
  }

  function parseLambda() {
    return {
      type: "lambda",
      vars: argumentDelimitor("(", ")", ",", parseVarName),
      body: parseExpression(),
    };
  }

  function parseCall(func) {
    return {
      type: "call",
      func: func,
      args: argumentDelimitor("(", ")", ",", parseExpression),
    };
  }

  function parseIf() {
    skipKeyword("if");
    var cond = parseExpression();
    if (!isPunctuation("{")) {
      skipKeyword("then");
    }
    var then = parseExpression();
    var ret = { type: "if", cond: cond, then: then };
    if (isKeyword("else")) {
      input.next();
      ret.else = parseExpression();
    }
  }

  function parseBoolean() {
    return {
      type: "bool",
      value: input.next().value == "true",
    };
  }

  // * ------------------------------------------------------
  // Check if the inputted token corresponds to a given value (e.g: "," === ",")
  function isOperator(op) {
    var token = input.peek();
    return token && token.type == "op" && (!op || token.value == op) && token;
  }
  function isKeyword(kw) {
    var token = input.peek();
    return token && token.type == "kw" && (!kw || token.value == kw) && token;
  }
  function isPunctuation(ch) {
    var token = input.peek();
    return token && token.type == "punc" && (!ch || token.value == ch) && token;
  }

  // * ------------------------------------------------------
  // Skip functions
  function skipOperator(op) {
    if (isOperator(op)) input.next();
    else input.croak('Expecting operator: "' + op + '"');
  }
  function skipKeyword(kw) {
    if (isKeyword(kw)) input.next();
    else input.croak('Expecting keyword: "' + kw + '"');
  }
  function skipPunctuation(ch) {
    if (isPunctuation(ch)) input.next();
    else input.croak('Expecting punctuation: "' + ch + '"');
  }
  function unexpected() {
    input.croak("Unexpected token: " + JSON.stringify(input.peek()));
  }

  // * ------------------------------------------------------
  // All maybes.
  function maybeCall(expr) {
    expr = expr();
    return isPunctuation("(") ? parseCall(expr) : expr;
  }

  function maybeBinary(left, currentPrecedence) {
    var token = isOperator();
    if (token) {
      var hisPrecendence = PRECEDENCE[token.value];
      if (hisPrecendence > currentPrecedence) {
        input.next();
        return maybeBinary(
          {
            type: token.value == "=" ? "assign" : "binary",
            operator: token.value,
            left: left,
            right: maybeBinary(parseAtom(), hisPrecendence),
          },
          currentPrecedence
        );
      }
    }
    return left;
  }

  function argumentDelimitor(start, stop, separator, parser) {
    var args = [],
      first = true;

    skipPunctuation(start);

    while (!input.eof()) {
      if (isPunctuation(stop)) break;
      if (first) first = false;
      else skipPunctuation(separator);
      if (isPunctuation(stop)) break;

      args.push(parser());
    }

    skipPunctuation(stop);
    return args;
  }
};