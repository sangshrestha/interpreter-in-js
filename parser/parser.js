import {
  BlockStatement,
  BooleanExpression,
  CallExpression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  IfExpression,
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
  [token.LPAREN]: CALL,
};

export function createParser(lexer) {
  let currentToken = lexer.nextToken();
  let peekToken = lexer.nextToken();

  const errors = [];

  const prefixParseFns = {
    [token.IDENT]: parseIdentifier,
    [token.INT]: parseIntegerLiteral,
    [token.BANG]: parsePrefixExpression,
    [token.MINUS]: parsePrefixExpression,
    [token.TRUE]: parseBooleanExpression,
    [token.FALSE]: parseBooleanExpression,
    [token.LPAREN]: parseGroupExpression,
    [token.IF]: parseIfExpression,
    [token.FUNCTION]: parseFunctionLiteral,
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
    [token.LPAREN]: parseCallExpression,
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
    return new Identifier(currentToken, currentToken.literal);
  }

  function parseIntegerLiteral() {
    const value = parseInt(currentToken.literal, 10);

    if (isNaN(value)) {
      errors.push(`Could not parse ${currentToken.literal} as int`);
      return null;
    }

    return new IntegerLiteral(currentToken, value);
  }

  function parsePrefixExpression() {
    const startToken = currentToken;
    const operator = currentToken.literal;

    advanceToken();

    const rightExp = parseExpression(PREFIX);
    return new PrefixExpression(startToken, operator, rightExp);
  }

  function parseInfixExpression(leftExp) {
    const token = currentToken;
    const precedence = getCurrentPrecedence();

    advanceToken();

    const rightExp = parseExpression(precedence);
    return new InfixExpression(token, leftExp, token.literal, rightExp);
  }

  function parseLetStatement() {
    const letToken = currentToken;

    if (!expectPeek(token.IDENT)) {
      return null;
    }

    const letIdentifier = new Identifier(currentToken, currentToken.literal);

    if (!expectPeek(token.ASSIGN)) {
      return null;
    }

    advanceToken();

    const letExpression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return new LetStatement(letToken, letIdentifier, letExpression);
  }

  function parseReturnStatement() {
    const returnToken = currentToken;

    advanceToken();

    const returnExpression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return new ReturnStatement(returnToken, returnExpression);
  }

  function parseBooleanExpression() {
    return new BooleanExpression(
      currentToken,
      currentToken.type === token.TRUE,
    );
  }

  function parseBlockStatement() {
    const startToken = currentToken;
    const statements = [];

    advanceToken();

    while (
      currentToken.type !== token.RBRACE &&
      currentToken.type !== token.EOF
    ) {
      const statement = parseStatement();

      if (statement !== null) {
        statements.push(statement);
      }
      advanceToken();
    }

    return new BlockStatement(startToken, statements);
  }

  function parseIfExpression() {
    const startToken = currentToken;

    if (peekToken.type !== token.LPAREN) {
      return null;
    }

    advanceToken(); // Advance to LPAREN
    advanceToken();

    const condition = parseExpression(LOWEST);

    if (peekToken.type !== token.RPAREN) {
      return null;
    }

    advanceToken();

    if (peekToken.type !== token.LBRACE) {
      return null;
    }

    advanceToken();
    const consequence = parseBlockStatement();

    let alternative = null;

    if (peekToken.type === token.ELSE) {
      advanceToken();

      if (peekToken.type !== token.LBRACE) {
        return null;
      }

      advanceToken();
      alternative = parseBlockStatement();
    }

    return new IfExpression(startToken, condition, consequence, alternative);
  }

  function parseFunctionLiteral() {
    const startToken = currentToken;

    if (peekToken.type !== token.LPAREN) {
      return null;
    }

    advanceToken();

    const parameters = parseFunctionParameters();

    if (peekToken.type !== token.LBRACE) {
      return null;
    }

    advanceToken();

    const body = parseBlockStatement();

    return new FunctionLiteral(startToken, parameters, body);
  }

  function parseFunctionParameters() {
    let identifiers = [];

    if (peekToken.type === token.RPAREN) {
      advanceToken();
      return identifiers;
    }

    advanceToken();

    identifiers.push(new Identifier(currentToken, currentToken.literal));

    while (peekToken.type === token.COMMA) {
      advanceToken();
      advanceToken();
      identifiers.push(new Identifier(currentToken, currentToken.literal));
    }

    if (peekToken.type !== token.RPAREN) {
      return null;
    }

    advanceToken();

    return identifiers;
  }

  function parseCallExpression(functionExpression) {
    const startToken = currentToken;
    const args = parseCallArguments();

    return new CallExpression(startToken, functionExpression, args);
  }

  function parseCallArguments() {
    let args = [];

    if (peekToken.type === token.RPAREN) {
      advanceToken();
      return args;
    }

    advanceToken();

    args.push(parseExpression(LOWEST));

    while (peekToken.type === token.COMMA) {
      advanceToken();
      advanceToken();
      args.push(parseExpression(LOWEST));
    }

    if (peekToken.type !== token.RPAREN) {
      return null;
    }

    advanceToken();

    return args;
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

  function parseGroupExpression() {
    advanceToken();

    const expression = parseExpression(LOWEST);

    if (peekToken.type !== token.RPAREN) {
      return null;
    }

    advanceToken();
    return expression;
  }

  function parseExpressionStatement() {
    const startToken = currentToken;
    const expression = parseExpression(LOWEST);

    if (peekToken.type === token.SEMICOLON) {
      advanceToken();
    }

    return new ExpressionStatement(startToken, expression);
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

    return new Program(statements);
  }

  return {
    getCurrentToken,
    getPeekToken,
    getErrors,
    advanceToken,
    parseProgram,
  };
}
