const { isDigit, isId, isIdStart, isOperator, isKeyword, isPunctuation, isWhitespace } = require("./utils/isType");
/*
 * (1.2) Parser: TOKENIZER (Or lexer)
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This will operate on the CIS (Character Input Stream) and return a stream Object with the same interface
 * but the values returned will be tokens. Instead of returning a simple string such as "a",
 * we will be creating tokens, and object with a type and a value such as { type: "str", value: "a" }
 *
 *
 * Reading rules:
 * If whitespace, skip.
 * If input.eof(), then return null.
 * If it's a sharp sign (#), skip comment (retry after the end of line).
 * If it's a quote then read a string.
 * If it's a digit, then we proceed to read a number.
 * If it's a “letter”, then read an identifier or a keyword token.
 * If it's one of the punctuation characters, return a punctuation token.
 * If it's one of the operator characters, return an operator token.
 * If none of the above, error out with input.croak(*
 * Dictates reading rules
 */

module.exports = function TokenStream(input) {
  var current = null;
  const KEYWORDS = " if then else lambda λ true false ";

  console.log("RUNS");

  // Methods available on TokenStream
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: input.croak,
  };

  function peek() {
    return current || (current = readNext());
  }

  function next() {
    var token = current;
    current = null;

    return token || readNext();
  }

  function eof() {
    return peek() == null;
  }

  // * ------------------------------------------------------
  // Functions that returns token corresponding to type of value.
  function readString() {
    return { type: "str", value: readEscaped('"') };
  }

  function readNumber() {
    var hasDot = false;
    var number = readWhile(function (ch) {
      if (ch == ".") {
        if (hasDot) {
          return false;
        }
        hasDot = true;
        return true;
      }
      return isDigit(ch);
    });
    return { type: "num", value: parseFloat(number) };
  }

  function readId() {
    var id = readWhile(isId);
    return {
      type: isKeyword(id) ? "keyword" : "var",
      value: id,
    };
  }

  function readOperator() {
    return {
      type: "op",
      value: readWhile(isOperator),
    };
  }

  function readPunctuation() {
    return {
      type: "punc",
      value: input.next(),
    };
  }

  function readEscaped(end) {
    // Escaped character invokes an alternative interpretation
    // on subsequent characters in a character sequence. Such as \', \\ ...
    var escaped = false;
    var str = "";

    input.next();

    while (!input.eof()) {
      var ch = input.next();

      if (escaped) {
        str = str + ch;
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str = str + ch;
      }
    }
    return str;
  }

  // * ------------------------------------------------------
  // Reading mechanics.
  function readWhile(predicate) {
    var str = "";
    while (!input.eof() && predicate(input.peek())) {
      console.log("On TokenStream -> Iterating over predicate", predicate(), str);
      str = str + input.next();
    }
    return str;
  }

  function readNext() {
    readWhile(isWhitespace);

    if (input.eof()) {
      return null;
    }

    var ch = input.peek();

    if (ch == "#") {
      skipComment();
      return readNext();
    }
    if (ch == '"') {
      return readString();
    }
    if (isDigit(ch)) {
      return readNumber();
    }
    if (isIdStart(ch)) {
      return readId();
    }
    if (isPunctuation(ch)) {
      return readPunctuation();
    }
    if (isOperator(ch)) {
      return readOperator();
    }

    return input.croak("Can't handle character on " + ch);
  }

  function skipComment() {
    var isNotNewline = function (ch) {
      return ch != "\n";
    };

    readWhile(isNotNewline);
    input.next();
  }
};
