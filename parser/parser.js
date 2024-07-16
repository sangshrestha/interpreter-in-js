import * as token from "../token/token.js";
import { ExpressionStatement, Identifier, IntegerLiteral, LetStatement, PrefixExpression, Program, ReturnStatement } from "../ast/ast.js";

const LOWEST = -1,
  EQUALS = 1,
  LESSGREATER = 2,
  SUM = 3,
  PRODUCT = 4,
  PREFIX = 5,
  CALL = 6

export function Parser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  const errors = [];

  const prefixParseFns = {
    [token.IDENT]: parseIdentifier,
    [token.INT]: parseIntegerLiteral,
    [token.BANG]: parsePrefixExpression,
    [token.MINUS]: parsePrefixExpression
  };

  const infixParseFns = {};

  function getCurrentToken() {
    return currentToken;
  }

  function getPeekToken() {
    return peekToken;
  }

  function getErrors() {
    return errors;
  }

  // function registerPrefix(tokenType, prefixParseFn) {
  //   prefixParseFns[tokenType] = prefixParseFn;
  // }
  //
  // function registerInfix(tokenType, infixParseFn) {
  //   infixParseFns[tokenType] = infixParseFn;
  // }

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

  function parseIdentifier() {
    return Identifier(currentToken, currentToken.literal);
  }

  function parseIntegerLiteral() {
    const value = parseInt(currentToken.literal, 10);

    if (isNaN(value)) {
      errors.push(`Could not parse ${currentToken.literal} as int`);
      return null;
    }

    return IntegerLiteral(currentToken, value);
  }

  function parsePrefixExpression() {
    const startToken = currentToken;
    const operator = currentToken.literal;

    advanceToken();

    const rightExp = parseExpression(PREFIX);

    return PrefixExpression(startToken, operator, rightExp);
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

  function parseExpression(precedence) {
    const prefixFn = prefixParseFns[currentToken.type];

    if (prefixFn === undefined) {
      errors.push(`No prefix parse function found for ${currentToken.type}`);
      return null;
    }

    return prefixFn();
  }

  function parseExpressionStatement() {
    const expression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return ExpressionStatement(currentToken, expression)
  }

  function parseStatement() {
    switch (currentToken.type) {
      case token.LET:
        return parseLetStatement();
      case token.RETURN:
        return parseReturnStatement();
      default:
        return parseExpressionStatement();
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
