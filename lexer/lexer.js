import * as token from "../token/token.js";
import { isDigitString, isLetter } from "../utility.js";

export class Lexer {
  #input;

  constructor(input) {
    this.#input = input;
    this.index = 0;
    this.peekIndex = 1;
  }

  get input() {
    return this.#input;
  }

  get char() {
    if (this.peekIndex > this.#input.length) {
      return 0;
    } else {
      return this.#input[this.index];
    }
  }

  #updateIndex() {
    this.index = this.peekIndex;
    this.peekIndex += 1;
  }

  #peekChar() {
    if (this.peekIndex > this.#input.length) {
      return 0;
    } else {
      return this.#input[this.peekIndex];
    }
  }

  #skipWhitespace() {
    while ([" ", "\n", "\t", "\r"].includes(this.char)) {
      this.#updateIndex();
    }
  }

  #readIdentifier() {
    const startIndex = this.index;

    while (isLetter(this.char)) {
      this.#updateIndex();
    }

    return this.#input.slice(startIndex, this.index);
  }

  #readDigit() {
    const startIndex = this.index;

    while (isDigitString(this.char)) {
      this.#updateIndex();
    }

    return this.#input.slice(startIndex, this.index);
  }

  nextToken() {
    this.#skipWhitespace();

    let thisToken;

    switch (this.char) {
      case ",":
        thisToken = token.Token(token.COMMA, this.char);
        break;

      case ";":
        thisToken = token.Token(token.SEMICOLON, this.char);
        break;

      case "(":
        thisToken = token.Token(token.LPAREN, this.char);
        break;

      case ")":
        thisToken = token.Token(token.RPAREN, this.char);
        break;

      case "{":
        thisToken = token.Token(token.LBRACE, this.char);
        break;

      case "}":
        thisToken = token.Token(token.RBRACE, this.char);
        break;

      case "=":
        if (this.#peekChar() === "=") {
          this.#updateIndex();
          thisToken = token.Token(token.EQ, "==");
        } else {
          thisToken = token.Token(token.ASSIGN, this.char);
        }
        break;

      case "+":
        thisToken = token.Token(token.PLUS, this.char);
        break;

      case "-":
        thisToken = token.Token(token.MINUS, this.char);
        break;

      case "!":
        if (this.#peekChar() === "=") {
          this.#updateIndex();
          thisToken = token.Token(token.NOT_EQ, "!=");
        } else {
          thisToken = token.Token(token.BANG, this.char);
        }
        break;

      case "*":
        thisToken = token.Token(token.ASTERISK, this.char);
        break;

      case "/":
        thisToken = token.Token(token.SLASH, this.char);
        break;

      case "<":
        thisToken = token.Token(token.LT, this.char);
        break;

      case ">":
        thisToken = token.Token(token.GT, this.char);
        break;

      case 0:
        thisToken = token.Token(token.EOF, "");
        break;

      default:
        if (isLetter(this.char)) {
          const ident = this.#readIdentifier();
          return token.Token(token.lookupIdent(ident), ident);
        } else if (isDigitString(this.char)) {
          return token.Token(token.INT, this.#readDigit());
        } else {
          thisToken = token.Token(token.ILLEGAL, this.char);
        }
    }

    this.#updateIndex();
    return thisToken;
  }
}
