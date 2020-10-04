const { inspect } = require("util");

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

function Environment(parent) {
  this.vars = Object.create(parent ? parent.vars : null);
  this.parent = parent;

  console.log(this);
}

Environment.prototype = {
  extend: function () {
    return new Environment(this);
  },
  lookup: function (name) {
    var scope = this;
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope;
      }
      scope = scope.parent;
    }
  },
  get: function (name) {
    if (name in this.vars) {
      return this.vars[name];
    }
    throw new Error(`Undefined variable + ${name}`);
  },
  set: function (name, value) {
    var scope = this.lookup(name);

    if (!scope && this.parent) {
      throw new Error(`Undefined variable + ${name}`);
    }

    return ((scope || this).vars[name] = value);
  },
  def: function (name, value) {
    return (this.vars[name] = value);
  },
};

var TEST_INPUT = `foo = "Hello world!"; bar = "Hello again!"`;

console.log(inspect(Environment.prototype, { showHidden: true, depth: null }));
// console.log(inspect(Parser(TokenStream(InputStream(TEST_INPUT))), { showHidden: true, depth: null }));
