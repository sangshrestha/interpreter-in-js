import { Lexer } from "./lexer";
import * as token from "#root/token/token.js";

it("assigns token for delimiters", () => {
  const delimiterString = new Lexer(",;(){}");

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
    expect(delimiterString.nextToken()).toEqual(expectedToken);
  });
});
