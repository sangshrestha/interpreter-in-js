// Abstract Syntax Tree

export function Node(token) {
  function tokenLiteral() {
    return token.literal
  }

  return {
    tokenLiteral
  }
}

export function Statement(token) {
  return {
    ...Node(token)
  }
}

export function Expression(token) {
  return {
    ...Node(token)
  }
}

export function Identifier(token, value) {
  function string() {
    return value;
  }

  return {
    token,
    value,
    string,
    ...Expression(token)
  }
}

export function IntegerLiteral(token, value) {
  function string() {
    return token.literal;
  }

  return {
    token,
    value,
    string,
    ...Expression(token)
  }
}

export function PrefixExpression(token, operator, rightExp) {
  function string() {
    return `(${operator}${rightExp.string()})`;
  }

  return {
    token,
    operator,
    rightExp,
    string,
    ...Expression(token)
  }
}

export function InfixExpression(token, leftExp, operator, rightExp) {
  function string() {
    return `(${leftExp.string()} ${operator} ${rightExp.string()})`;
  }

  return {
    token,
    leftExp,
    operator,
    rightExp,
    string,
    ...Expression(token)
  }
}

export function LetStatement(token, identifier, value) {
  function string() {
    return `${token.literal} ${identifier.string()} = ${value === null ? "" : value.string()};`
  }

  return {
    token,
    identifier,
    value,
    string,
    ...Statement(token)
  }
}

export function ReturnStatement(token, value) {
  function string() {
    return `${token.literal} ${value === null ? "" : value.string()};`
  }

  return {
    token,
    value,
    string,
    ...Statement(token)
  }
}

export function ExpressionStatement(token, expression) {
  function string() {
    return `${expression === null ? "" : expression.string()}`
  }

  return {
    token,
    expression,
    string,
    ...Statement(token)
  }
}

export function Program(statements) {
  function tokenLiteral() {
    if (statements.length > 0) {
      return statements[0].tokenLiteral()
    } else {
      return ""
    }
  }

  function string() {
    return statements.map(statement => statement.string()).join("");
  }

  return {
    statements,
    tokenLiteral,
    string
  }
}
