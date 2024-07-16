// Abstract Syntax Tree

export function Node(token, string) {
  function tokenLiteral() {
    return token.literal
  }

  return {
    tokenLiteral,
    string
  }
}

export function Statement(token, string) {
  return {
    ...Node(token, string)
  }
}

export function Expression(token, string) {
  return {
    ...Node(token, string)
  }
}

export function Identifier(token, value) {
  function string() {
    return value;
  }

  return {
    token,
    value,
    ...Expression(token, string)
  }
}

export function IntegerLiteral(token, value) {
  function string() {
    return token.literal;
  }

  return {
    token,
    value,
    ...Expression(token, string)
  }
}

export function LetStatement(token, identifier, value) {
  function string() {
    return `${this.tokenLiteral()} ${identifier.string()} = ${value === null ? "" : value.string()};`
  }

  return {
    token,
    identifier,
    value,
    ...Statement(token, string)
  }
}

export function ReturnStatement(token, value) {
  function string() {
    return `${this.tokenLiteral()} ${value === null ? "" : value.string()};`
  }

  return {
    token,
    value,
    ...Statement(token, string)
  }
}

export function ExpressionStatement(token, expression) {
  function string() {
    return `${expression === null ? "" : expression.string()}`
  }

  return {
    token,
    expression,
    ...Statement(token, string)
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
