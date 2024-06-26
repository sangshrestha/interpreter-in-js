import * as token from "#root/token/token.js";
import { isLetter } from "#root/utility.js";
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

  nextToken() {
    this.#skipWhitespace();

    const tok = { literal: this.char };

    switch (this.char) {
      case ",":
        tok.type = token.COMMA;
        break;

      case ";":
        tok.type = token.SEMICOLON;
        break;

      case "(":
        tok.type = token.LPAREN;
        break;

      case ")":
        tok.type = token.RPAREN;
        break;

      case "{":
        tok.type = token.LBRACE;
        break;

      case "}":
        tok.type = token.RBRACE;
        break;

      case "=":
        tok.type = token.ASSIGN;
        break;

      case "+":
        tok.type = token.PLUS;
        break;

      case "-":
        tok.type = token.MINUS;
        break;

      case "!":
        tok.type = token.BANG;
        break;

      case "*":
        tok.type = token.ASTERISK;
        break;

      case "/":
        tok.type = token.SLASH;
        break;

      case "<":
        tok.type = token.LT;
        break;

      case ">":
        tok.type = token.GT;
        break;

      case 0:
        tok.type = token.EOF;
        tok.literal = "";
        break;

      default:
        if (isLetter(this.char)) {
          tok.literal = this.#readIdentifier();
          tok.type = token.lookupIdent(tok.literal);
          return tok;
        }
    }

    this.#updateIndex();
    return tok;
  }
}

const test = new Lexer("fn");

console.log(test.nextToken());
