/*
 * (1.3) Parser: PARSING
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This will operate on the stream tokens (e.g: if) generated by the lexer(e.g: i,f), establishing programs,
 * turnining it into an AST the structural representation of the program.
 * This kind of parser is called a “recursive descent parser”. All these functions are “mutually recursive”.
 *
 */

function Parser() {
  const ARG_START = "(";
  const ARG_STOP = ")";
  const ARG_SEPARATOR = ",";

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

  function skipPunctuation() {
    return null;
  }

  function skipKeyword() {
    return null;
  }

  function isPunctuation() {
    return null;
  }

  function isKeyword() {
    return null;
  }

  // STOPED HERE
  function argumentDelimitor(start, stop, separator, parser) {
    var args = [];
    var first = true;
    skipPunctuation(start);

    while (!input.eof()) {
      if (isPunctuation(stop)) {
        break;
      }
      if (isPunctuation(first)) {
        first = false;
      }
      if (isPunctuation(stop)) {
        break;
      }
      args.push(parser);
    }

    skipPunctuation(stop);
    return args;
  }

  function parseAtom() {
    return maybeCall(function () {
      if (isPunctuation("(")) {
        input.next();
        var exp = parseExpression();
        skipPunctuation(")");
        return exp;
      }

      if (isKeyword("if")) return parseIf();
      if (isKeyword("true") || isKeyword("false")) return parseBoolean();
      if (isKeyword("lambda") || isKeyword("λ")) {
        input.next();
        return parseLambda();
      }

      var token = input.next();
      if (token.type == "var" || token.type == "num" || token.type == "str") return token;
      unexpected();
    });
  }

  function parseExpression() {
    return MaybeCall(function () {
      return MaybeBinary(parseAtom(), 0);
    });
  }

  function parseTopLevel() {
    var program = [];

    while (!input.eof()) {
      program.push(parse_expression());

      if (!input.eof()) {
        return skipPunctuation(ARG_SEPARATOR);
      }
    }

    return { type: "prog", prog: prog };
  }

  function maybeCall(expr) {
    expr = expr();
    return isPunctuation("(") ? parseCall(expr) : expr;
  }

  // Single purpose parsers for all types of tokens.

  function parseLambda() {
    return {
      type: "lambda",
      vars: argumentDelimitor(ARG_START, ARG_STOP, ARG_SEPARATOR, parseVarname),
      body: parseExpression(),
    };
  }

  function parseProgram() {
    var prog = delimited("{", "}", ";", parse_expression);
    if (prog.length == 0) return FALSE;
    if (prog.length == 1) return prog[0];
    return { type: "prog", prog: prog };
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

    var ret = {
      type: "if",
      cond: cond,
      then: then,
    };

    if (isKeyword("else")) {
      input.next();
      ret.else = parseExpression();
    }

    return ret;
  }
}
