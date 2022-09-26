// Copied from js-tokens v5 https://github.com/lydell/js-tokens
// But removed the part to match "regex" token in order to avoid divider/regex bug.
// As a result, a real regex will be parsed as multiple tokens, but that does not
// matter in generating source map.
const regex = /((['"])(?:(?!\2)[^\\\n\r]|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;

module.exports = function(code) {
  if (code === '') return [];
  regex.lastIndex = 0;

  let m, lastLine = 1, lastColumn = 0, lastPos = 0;
  const fullTokens = [];

  while ((m = regex.exec(code)) !== null) {
    const tokenStr = m[0];

    fullTokens.push({
      value: tokenStr,
      start: lastPos,
      end: lastPos + tokenStr.length,
      line: lastLine,
      column: lastColumn
    });

    lastPos += tokenStr.length;
    for (let c of tokenStr) {
      if (c === '\n') { // only support \r\n or \n
        lastLine += 1;
        lastColumn = 0;
      } else {
        lastColumn += 1;
      }
    }
  }

  return fullTokens;
};
