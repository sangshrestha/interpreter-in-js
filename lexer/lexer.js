import * as token from "../token/token.js";
import { isDigitString, isLetter } from "../utility.js";


export function Lexer(input) {
  let index = 0;
  let peekIndex = 1;

  function getChar() {
    if (peekIndex > input.length) {
      return 0;
    } else {
      return input[index];
    }
  }

  function peekChar() {
    if (peekIndex > input.length) {
      return 0;
    } else {
      return input[peekIndex];
    }
  }

  function updateIndex() {
    index = peekIndex;
    peekIndex += 1;
  }

  function skipWhitespace() {
    while ([" ", "\n", "\t", "\r"].includes(getChar())) {
      updateIndex();
    }
  }

  function readIdentifier() {
    const startIndex = index;

    while (isLetter(getChar())) {
      updateIndex();
    }

    return input.slice(startIndex, index);
  }

  function readDigit() {
    const startIndex = index;

    while (isDigitString(getChar())) {
      updateIndex();
    }

    return input.slice(startIndex, index);
  }

  function nextToken() {
    skipWhitespace();

    let thisToken;

    switch (getChar()) {
      case ",":
        thisToken = token.Token(token.COMMA, getChar());
        break;

      case ";":
        thisToken = token.Token(token.SEMICOLON, getChar());
        break;

      case "(":
        thisToken = token.Token(token.LPAREN, getChar());
        break;

      case ")":
        thisToken = token.Token(token.RPAREN, getChar());
        break;

      case "{":
        thisToken = token.Token(token.LBRACE, getChar());
        break;

      case "}":
        thisToken = token.Token(token.RBRACE, getChar());
        break;

      case "=":
        if (peekChar() === "=") {
          updateIndex();
          thisToken = token.Token(token.EQ, "==");
        } else {
          thisToken = token.Token(token.ASSIGN, getChar());
        }
        break;

      case "+":
        thisToken = token.Token(token.PLUS, getChar());
        break;

      case "-":
        thisToken = token.Token(token.MINUS, getChar());
        break;

      case "!":
        if (peekChar() === "=") {
          updateIndex();
          thisToken = token.Token(token.NOT_EQ, "!=");
        } else {
          thisToken = token.Token(token.BANG, getChar());
        }
        break;

      case "*":
        thisToken = token.Token(token.ASTERISK, getChar());
        break;

      case "/":
        thisToken = token.Token(token.SLASH, getChar());
        break;

      case "<":
        thisToken = token.Token(token.LT, getChar());
        break;

      case ">":
        thisToken = token.Token(token.GT, getChar());
        break;

      case 0:
        thisToken = token.Token(token.EOF, "");
        break;

      default:
        if (isLetter(getChar())) {
          const ident = readIdentifier();
          return token.Token(token.lookupIdent(ident), ident);
        } else if (isDigitString(getChar())) {
          return token.Token(token.INT, readDigit());
        } else {
          thisToken = token.Token(token.ILLEGAL, getChar());
        }
    }

    updateIndex();
    return thisToken;
  }

  return {
    getChar,
    nextToken
  }
}
