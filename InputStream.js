/*
 * (1.1) Parser: CHARACTER INPUT STREAM
 * ------------------------------------------------------
 * ------------------------------------------------------
 * The Stream Object will provide the operations so we can read characters from a string.
 *
 */

module.exports = function InputStream(input) {
  var POS = 0;
  var LINE = 1;
  var COL = 0;

  // Methods available on InputStream
  return {
    next: next,
    peek: peek,
    eof: eof,
    croak: croak,
  };

  function next() {
    var ch = input.charAt(POS++);
    if (ch == "\n") {
      LINE++;
      COL = 0;
    } else COL++;

    return ch;
  }

  function peek() {
    return input.charAt(POS);
  }

  function eof() {
    return peek() == "";
  }

  function croak(msg) {
    throw new Error(msg + ` line: ${LINE}, col: ${COL}`);
  }
};
