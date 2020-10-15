/*
 * (1.1) Parser: CHARACTER INPUT STREAM
 * ------------------------------------------------------
 * ------------------------------------------------------
 * The Stream Object will provide the operations so we can read characters from a string.
 *
 */

module.exports = function InputStream(input) {
  var pos = 0,
    line = 1,
    col = 0;

  // Methods available on InputStream
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: croak,
  };

  function next() {
    var ch = input.charAt(pos++);
    if (ch == "\n") line++, (col = 0);
    else col++;
    return ch;
  }

  function peek() {
    return input.charAt(pos);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new Error(`In Lambda: ${msg}  +  line: ${line}, col: ${col}`);
  }
};
