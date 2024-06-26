import { isLetter } from "./utility";

describe("isLetter()", () => {
  it("returns false for undefined", () => {
    expect(isLetter()).toEqual(false);
  });

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
});
