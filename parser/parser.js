import * as token from "../token/token.js";
import { Lexer } from "../lexer/lexer.js";
import { Identifier, LetStatement, Program, ReturnStatement } from "../ast/ast.js";

export function Parser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();
  const errors = [];

  function getCurrentToken() {
    return currentToken;
  }

  function getPeekToken() {
    return peekToken;
  }

  function getErrors() {
    return errors;
  }

  function advanceToken() {
    currentToken = peekToken;
    peekToken = lexer.nextToken();
  }

  function peekError(tokenType) {
    errors.push(`Expected token ${tokenType}, got ${peekToken.type}`)
  }

  function expectPeek(tokenType) {
    if (peekToken.type === tokenType) {
      advanceToken();
      return true;
    } else {
      peekError(tokenType);
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

  function parseReturnStatement() {
    const returnToken = currentToken;

    advanceToken();

    while (currentToken.type !== token.SEMICOLON) {
      advanceToken();
    }

    return ReturnStatement(returnToken, null);
  }

  function parseStatement() {
    switch (currentToken.type) {
      case token.LET:
        return parseLetStatement();
      case token.RETURN:
        return parseReturnStatement();
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
    getErrors,
    advanceToken,
    parseProgram
  }
}
