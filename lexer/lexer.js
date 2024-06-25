import * as token from "#root/token/token.js";
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

  updateIndex() {
    this.index = this.peekIndex;
    this.peekIndex += 1;
  }

  nextToken() {
    let tok = { literal: this.char };

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

      case 0:
        tok.type = token.EOF;
        tok.literal = "";
        break;

      default:
    }

    this.updateIndex();
    return tok;
  }
}
