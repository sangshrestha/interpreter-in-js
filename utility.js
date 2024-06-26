export function isLetter(char) {
  if (!char) {
    return false;
  } else if (char.length > 1) {
    throw new RangeError("char length exceeded");
  }

  const isLower = "a" <= char && char <= "z";
  const isUpper = "A" <= char && char <= "Z";
  const isUnderscore = char === "_";

  return isLower || isUpper || isUnderscore;
}
