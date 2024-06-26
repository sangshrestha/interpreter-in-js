export function isLetter(char) {
  if (typeof char === "string") {
    if (char.length > 1) {
      throw new RangeError("char length exceeded");
    }

    const isLower = "a" <= char && char <= "z";
    const isUpper = "A" <= char && char <= "Z";
    const isUnderscore = char === "_";

    return isLower || isUpper || isUnderscore;
  } else {
    return false;
  }
}

export function isDigitString(digit) {
  if (typeof digit === "string") {
    if (digit.length > 1) {
      throw new RangeError("digits exceeded");
    }

    return "0" <= digit && digit <= "9";
  } else {
    return false;
  }
}
