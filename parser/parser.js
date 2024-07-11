import { Lexer } from "../lexer/lexer.js";

export function Parser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  function getCurrentToken() {
    return currentToken;
  }

  function getPeekToken() {
    return peekToken;
  }

  function nextToken() {
    currentToken = peekToken;
    peekToken = lexer.nextToken()
  }

  function parseProgram() {
    return null;
  }

  return {
    getCurrentToken,
    getPeekToken,
    nextToken,
    parseProgram
  }
}

// TODO: Remove this log
console.log(Parser(Lexer("let 5")));
