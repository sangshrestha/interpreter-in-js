import { Lexer } from "./lexer";
import * as token from "#root/token/token.js";

describe("Lexer.nextToken()", () => {
  it("assigns token for delimiters", () => {
    const testString = ",;(){}";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.COMMA, literal: "," },
      { type: token.SEMICOLON, literal: ";" },
      { type: token.LPAREN, literal: "(" },
      { type: token.RPAREN, literal: ")" },
      { type: token.LBRACE, literal: "{" },
      { type: token.RBRACE, literal: "}" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });

  it("assigns token for single char operators", () => {
    const testString = "=+-!*/<>";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.ASSIGN, literal: "=" },
      { type: token.PLUS, literal: "+" },
      { type: token.MINUS, literal: "-" },
      { type: token.BANG, literal: "!" },
      { type: token.ASTERISK, literal: "*" },
      { type: token.SLASH, literal: "/" },
      { type: token.LT, literal: "<" },
      { type: token.GT, literal: ">" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });

  it("ignores whitespaces", () => {
    const testString = ` ,  = 
    *     

          ;

    `;
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.COMMA, literal: "," },
      { type: token.ASSIGN, literal: "=" },
      { type: token.ASTERISK, literal: "*" },
      { type: token.SEMICOLON, literal: ";" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });

  it("assigns token for keywords and identifiers", () => {
    const testString =
      "fn sang let true Hello WORLD false twenty_three if else return";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.FUNCTION, literal: "fn" },
      { type: token.IDENT, literal: "sang" },
      { type: token.LET, literal: "let" },
      { type: token.TRUE, literal: "true" },
      { type: token.IDENT, literal: "Hello" },
      { type: token.IDENT, literal: "WORLD" },
      { type: token.FALSE, literal: "false" },
      { type: token.IDENT, literal: "twenty_three" },
      { type: token.IF, literal: "if" },
      { type: token.ELSE, literal: "else" },
      { type: token.RETURN, literal: "return" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });

  it("assigns token for single digits", () => {
    const testString = "0 1 2 3 4 5 6 7 8 9";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.INT, literal: "0" },
      { type: token.INT, literal: "1" },
      { type: token.INT, literal: "2" },
      { type: token.INT, literal: "3" },
      { type: token.INT, literal: "4" },
      { type: token.INT, literal: "5" },
      { type: token.INT, literal: "6" },
      { type: token.INT, literal: "7" },
      { type: token.INT, literal: "8" },
      { type: token.INT, literal: "9" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });

  it("assigns token for long digits", () => {
    const testString = "01 2345678 90000000000000";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.INT, literal: "01" },
      { type: token.INT, literal: "2345678" },
      { type: token.INT, literal: "90000000000000" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });
});
