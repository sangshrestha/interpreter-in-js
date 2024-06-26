import { isLetter, isDigitString } from "./utility";

describe("isLetter()", () => {
  it("returns true for allowed chars", () => {
    const allowedChars = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "_",
    ];
    allowedChars.forEach((char) => {
      expect(isLetter(char)).toEqual(true);
    });
  });

  it("returns false for 'á'", () => {
    expect(isLetter("á")).toEqual(false);
  });

  it("returns false for '2'", () => {
    expect(isLetter("2")).toEqual(false);
  });

  it("returns false for '-'", () => {
    expect(isLetter("-")).toEqual(false);
  });

  it("returns false for ' '", () => {
    expect(isLetter(" ")).toEqual(false);
  });

  it("throws error if char is too long", () => {
    expect(() => isLetter("abc")).toThrow(RangeError);
  });

  it("throws error if char is undefined", () => {
    expect(() => isLetter()).toThrow(TypeError);
  });
});

describe("isDigitString()", () => {
  it("returns true for string digits", () => {
    const allowedDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    allowedDigits.forEach((digit) => {
      expect(isDigitString(digit)).toEqual(true);
    });
  });

  it("returns false for 0", () => {
    expect(isDigitString(0)).toEqual(false);
  });

  it("returns false for 9", () => {
    expect(isDigitString(9)).toEqual(false);
  });

  it("returns false for 'a'", () => {
    expect(isDigitString("a")).toEqual(false);
  });

  it("returns false for ' '", () => {
    expect(isDigitString(" ")).toEqual(false);
  });

  it("throws error if too many digits", () => {
    expect(() => isDigitString("12")).toThrow(RangeError);
  });

  it("throws error if digit is undefined", () => {
    expect(() => isDigitString()).toThrow(TypeError);
  });
});
