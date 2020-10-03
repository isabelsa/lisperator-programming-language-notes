const InputStream = require("./InputStream");
const TokenStream = require("./TokenStream");
const Parser = require("./Parser");

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

var TEST_INPUT = "123.5";

console.log(Parser(TokenStream(InputStream(TEST_INPUT))));
