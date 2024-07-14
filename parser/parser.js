import * as token from "../token/token.js";
import { Lexer } from "../lexer/lexer.js";
import { Identifier, LetStatement, Program } from "../ast/ast.js";

export function Parser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  function getCurrentToken() {
    return currentToken;
  }

  function getPeekToken() {
    return peekToken;
  }

  function advanceToken() {
    currentToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function expectPeek(tokenType) {
    if (peekToken.type === tokenType) {
      advanceToken();
      return true;
    } else {
      return false;
    }
  }

  function parseLetStatement() {
    const letToken = currentToken;

    if (!expectPeek(token.IDENT)) {
      return null;
    }

    const letIdentifier = Identifier(currentToken, currentToken.literal)
    if (!expectPeek(token.ASSIGN)) {
      return null;
    }

    while (currentToken.type !== token.SEMICOLON) {
      advanceToken();
    }

    return LetStatement(letToken, letIdentifier, null)
  }


  function parseStatement() {
    switch (currentToken.type) {
      case token.LET:
        return parseLetStatement();
      default:
        return null;
    }

  }

  function parseProgram() {
    let statements = [];

    while (currentToken.type !== token.EOF) {
      const statement = parseStatement();

      if (statement !== null) {
        statements.push(statement);
      }
      advanceToken();
    }

    return Program(statements);
  }

  return {
    getCurrentToken,
    getPeekToken,
    advanceToken,
    parseProgram
  }
}

// TODO: Remove this log
let myParser = Parser(Lexer("let kekw = 5;"))
console.log("Parser: ", JSON.stringify(myParser.parseProgram()));
