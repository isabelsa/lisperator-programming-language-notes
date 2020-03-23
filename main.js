const InputStream = require("./InputStream");
const TokenStream = require("./TokenStream");
const Parser = require("./Parser");

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
 */

console.log(TokenStream(InputStream("cena")).next());
