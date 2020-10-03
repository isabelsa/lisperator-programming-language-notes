const KEYWORDS = " if then else lambda λ true false ";

// On regex /i stands for ignore case (case-insensitive) in the given string.
function isKeyword(ch) {
  return KEYWORDS.indexOf(" " + ch + " ") >= 0;
}
function isDigit(ch) {
  return /[0-9]/i.test(ch);
}
function isIdStart(ch) {
  return /[a-zλ_]/i.test(ch);
}
function isId(ch) {
  return isIdStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
}
function isOperator(ch) {
  return "+-*/%=&|<>!".indexOf(ch) >= 0;
}
function isPunctuation(ch) {
  return ",;(){}[]".indexOf(ch) >= 0;
}
function isWhitespace(ch) {
  return " \t\n".indexOf(ch) >= 0;
}

module.exports = {
  isDigit,
  isId,
  isIdStart,
  isOperator,
  isKeyword,
  isPunctuation,
  isWhitespace,
};
