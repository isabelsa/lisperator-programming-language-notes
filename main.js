const string = "";

/*
 * (0) Introduction: THE LANGUAGE
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This an implementation of a LISP-like language based on Lisperator.net's tutorial on how to implement
 * a programming language in Javascript. These are some observations and implementations of the tutorial.
 *
 * The syntax we're trying to achieve:
 *
 *  # this is a comment
 *
 *  println("Hello World!");
 *
 *  println(2 + 3 * 4);
 *
 *  # functions are introduced with `lambda` or `λ`
 *  fib = lambda (n) if n < 2 then n else fib(n - 1) + fib(n - 2);
 *
 *  println(fib(15));
 *
 *  print-range = λ(a, b)             # `λ` is synonym to `lambda`
 *                  if a <= b then {  # `then` here is optional as you can see below
 *                    print(a);
 *                    if a + 1 <= b {
 *                      print(", ");
 *                      print-range(a + 1, b);
 *                    } else println("");        # newline
 *                  };
 *  print-range(1, 5);
 *
 *
 * Rules:
 * -----
 * There are no statements, only expressions
 * Functions are introduced with one of the keywords lambda or λ
 *
 *
 *
 * (1) Parser: THE PARSER
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This will inspect our code by character and turn it into an AST (Abstract Syntax Tree),
 * the structural representation of the program, showing it's semantics faithfully.
 *
 * sum = lambda(a, b) {
 *   a + b;
 * };
 *
 * Turns into
 * --->
 *
 * {
 *   type: "prog",
 *   prog: [
 *     // first line:
 *     {
 *       type: "assign",
 *       operator: "=",
 *       left: { type: "var", value: "sum" },
 *       right: {
 *         type: "lambda",
 *         vars: [ "a", "b" ],
 *         body: {
 *           // the body should be a "prog", but because
 *           // it contains a single expression, our parser
 *           // reduces it to the expression itself.
 *           type: "binary",
 *           operator: "+",
 *           left: { type: "var", value: "a" },
 *           right: { type: "var", value: "b" }
 *         }
 *       }
 *     },
 *     // second line:
 *     {
 *       type: "call",
 *       func: { type: "var", value: "print" },
 *       args: [{
 *         type: "call",
 *         func: { type: "var", value: "sum" },
 *         args: [ { type: "num", value: 1 },
 *                 { type: "num", value: 2 } ]
 *       }]
 *     }
 *   ]
 * }
 *
 *
 * (1.1) Parser: CHARACTER INPUT STREAM
 * ------------------------------------------------------
 * ------------------------------------------------------
 * The Stream Object will provide the operations so we can read characters from a string.
 *
 */

function InputStream(input) {
  var pos = 0;
  var line = 1;
  var col = 0;

  return {
    next: next,
    peek: peek,
    eof: eof,
    //EOF: End of file
    croak: croak,
  };

  function next() {
    var ch = input.charAt(pos++);
    if (ch == "\n") {
      line++;
      col = 0;
    } else col++;

    return ch;
  }

  function peek() {
    return input.charAt(pos);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new Error(msg + ` line: ${line}, col: ${col}`);
  }
}
/*
 * (1.2) Parser: TOKENIZER (Or lexer)
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This will operate on the CIS (Character Input Stream) and return a stream Object with the same interface
 * but the values returned will be tokens. Instead of returning a simple string such as "a",
 * we will be creating tokens, and object with a type and a value such as { type: "str", value: "a" }
 *
 */

function TokenStream(input) {
  // Is typeof utilities
  function isDigit(ch) {
    return /[0-9]/i.test(ch);
  }
  function isPunctuation(ch) {
    return ",;(){}[]".indexOf(ch) >= 0;
  }
  function isWhitespace(ch) {
    return " \t\n".indexOf(ch) >= 0;
  }

  // If whitespace, skip.
  // If input.eof(), then return null.
  // If it's a sharp sign (#), skip comment (retry after the end of line).
  // If it's a quote then read a string.
  // If it's a digit, then we proceed to read a number.
  // If it's a “letter”, then read an identifier or a keyword token.
  // If it's one of the punctuation characters, return a punctuation token.
  // If it's one of the operator characters, return an operator token.
  // If none of the above, error out with input.croak().

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
      return readIdent();
    }
    if (isIdStart(ch)) {
      return readIdent();
    }
    if (isPunctuation(ch)) {
      return {
        type: "punc",
        value: input.next(),
      };
    }
    if (isOperatorCh(ch))
      return {
        type: "op",
        value: readWhile(isOperatorCh),
      };

    return input.croak("Can't handle character on " + ch);
  }
}
