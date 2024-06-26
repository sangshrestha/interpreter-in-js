export function isLetter(char) {
  if (char === undefined) {
    throw new TypeError("char is undefined");
  } else if (char.length > 1) {
    throw new RangeError("char length exceeded");
  }

  const isLower = "a" <= char && char <= "z";
  const isUpper = "A" <= char && char <= "Z";
  const isUnderscore = char === "_";

  return isLower || isUpper || isUnderscore;
}

export function isDigitString(digit) {
  if (digit === undefined) {
    throw new TypeError("digit is undefined");
  }

  if (Object.prototype.toString.call(digit) === "[object String]") {
    if (digit.toString().length > 1) {
      throw new RangeError("digits exceeded");
    }

    return "0" <= digit && digit <= "9";
  } else return false;
}
