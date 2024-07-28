import {
  Bool,
  ExpressionStatement,
  Identifier,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  Program,
  ReturnStatement,
} from "../ast/ast.js";
import * as token from "../token/token.js";

const LOWEST = -1,
  EQUALS = 1,
  LESSGREATER = 2,
  SUM = 3,
  PRODUCT = 4,
  PREFIX = 5,
  CALL = 6;

const precedences = {
  [token.EQ]: EQUALS,
  [token.NOT_EQ]: EQUALS,
  [token.LT]: LESSGREATER,
  [token.GT]: LESSGREATER,
  [token.PLUS]: SUM,
  [token.MINUS]: SUM,
  [token.SLASH]: PRODUCT,
  [token.ASTERISK]: PRODUCT,
};

export function Parser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  const errors = [];

  const prefixParseFns = {
    [token.IDENT]: parseIdentifier,
    [token.INT]: parseIntegerLiteral,
    [token.BANG]: parsePrefixExpression,
    [token.MINUS]: parsePrefixExpression,
    [token.TRUE]: parseBool,
    [token.FALSE]: parseBool,
  };

  const infixParseFns = {
    [token.PLUS]: parseInfixExpression,
    [token.MINUS]: parseInfixExpression,
    [token.SLASH]: parseInfixExpression,
    [token.ASTERISK]: parseInfixExpression,
    [token.EQ]: parseInfixExpression,
    [token.NOT_EQ]: parseInfixExpression,
    [token.LT]: parseInfixExpression,
    [token.GT]: parseInfixExpression,
  };

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
    errors.push(`Expected token ${tokenType}, got ${peekToken.type}`);
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

  function getPeekPrecedence() {
    return precedences[peekToken.type] || LOWEST;
  }

  function getCurrentPrecedence() {
    return precedences[currentToken.type] || LOWEST;
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

  function parseInfixExpression(leftExp) {
    const token = currentToken;
    const precedence = getCurrentPrecedence();

    advanceToken();

    const rightExp = parseExpression(precedence);
    return InfixExpression(token, leftExp, token.literal, rightExp);
  }

  function parseLetStatement() {
    const letToken = currentToken;

    if (!expectPeek(token.IDENT)) {
      return null;
    }

    const letIdentifier = Identifier(currentToken, currentToken.literal);

    if (!expectPeek(token.ASSIGN)) {
      return null;
    }

    advanceToken();

    const letExpression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return LetStatement(letToken, letIdentifier, letExpression);
  }

  function parseReturnStatement() {
    const returnToken = currentToken;

    advanceToken();

    const returnExpression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return ReturnStatement(returnToken, returnExpression);
  }

  function parseBool() {
    return Bool(currentToken, currentToken.type === token.TRUE);
  }

  function parseExpression(precedence) {
    const prefixFn = prefixParseFns[currentToken.type];

    if (prefixFn === undefined) {
      errors.push(`No prefix parse function found for ${currentToken.type}`);
      return null;
    }

    let leftExp = prefixFn();

    while (
      peekToken.type !== token.SEMICOLON &&
      precedence < getPeekPrecedence()
    ) {
      const infixFn = infixParseFns[peekToken.type];

      if (infixFn === undefined) {
        return leftExp;
      }

      advanceToken();

      leftExp = infixFn(leftExp);
    }

    return leftExp;
  }

  function parseExpressionStatement() {
    const expression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return ExpressionStatement(currentToken, expression);
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
    parseProgram,
  };
}
