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
  return {
    token,
    value,
    ...Expression(token)
  }
}

export function LetStatement(token, identifier, expression) {
  return {
    token,
    identifier,
    expression,
    ...Statement(token)
  }
}

export function ReturnStatement(token, expression) {
  return {
    token,
    expression,
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

  return {
    statements,
    tokenLiteral
  }
}
