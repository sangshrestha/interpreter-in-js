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

  it("assigns token for keywords", () => {
    const testString = "fn let true false if else return";
    const testLexer = new Lexer(testString);

    const expectedTokens = [
      { type: token.FUNCTION, literal: "fn" },
      { type: token.LET, literal: "let" },
      { type: token.TRUE, literal: "true" },
      { type: token.FALSE, literal: "false" },
      { type: token.IF, literal: "if" },
      { type: token.ELSE, literal: "else" },
      { type: token.RETURN, literal: "return" },
      { type: token.EOF, literal: "" },
    ];

    expectedTokens.forEach((expectedToken) => {
      expect(testLexer.nextToken()).toEqual(expectedToken);
    });
  });
});
