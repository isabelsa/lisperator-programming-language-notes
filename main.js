const { inspect } = require("util");

const Environment = require("./environment");
const InputStream = require("./parser/inputStream");
const TokenStream = require("./parser/tokenStream");
const evaluate = require("./evaluate");
const parse = require("./parser/parse");

/*
 * START HERE
 * Introduction: THE LANGUAGE
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This an implementation of a LISP-like language based on Lisperator.net's tutorial on how to implement
 * a programming language in Javascript. These are some observations and implementations of the tutorial.
 * The syntax we're trying to achieve is available with examples on the `ast.md` file.
 *
 *
 * */

/*
 * START HERE
 * Introduction: THE LANGUAGE
 * ------------------------------------------------------
 * ------------------------------------------------------
 * This an implementation of a LISP-like language based on Lisperator.net's tutorial on how to implement
 * a programming language in Javascript. These are some observations and implementations of the tutorial.
 * The syntax we're trying to achieve is available with examples on the `ast.md` file.
 *
 *
 * */

var CODE = "sum = lambda(x, y) x + y; print(sum(2, 3));";

var ast = parse(TokenStream(InputStream(CODE)));
var globalEnv = new Environment();

globalEnv.def("print", function (txt) {
  console.log(txt);
});

evaluate(ast, globalEnv);
