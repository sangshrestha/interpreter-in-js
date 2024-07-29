// Abstract Syntax Tree

export function Node(token) {
  function tokenLiteral() {
    return token.literal;
  }

  return {
    tokenLiteral,
  };
}

export function Statement(token) {
  return {
    ...Node(token),
  };
}

export function Expression(token) {
  return {
    ...Node(token),
  };
}

export function Identifier(token, value) {
  function string() {
    return value;
  }

  return {
    token,
    value,
    string,
    ...Expression(token),
  };
}

export function IntegerLiteral(token, value) {
  function string() {
    return token.literal;
  }

  return {
    token,
    value,
    string,
    ...Expression(token),
  };
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
    ...Expression(token),
  };
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
    ...Expression(token),
  };
}

export function LetStatement(token, identifier, expression) {
  function string() {
    return `${token.literal} ${identifier.string()} = ${expression === null ? "" : expression.string()};`;
  }

  return {
    token,
    identifier,
    expression,
    string,
    ...Statement(token),
  };
}

export function ReturnStatement(token, expression) {
  function string() {
    return `${token.literal} ${expression === null ? "" : expression.string()};`;
  }

  return {
    token,
    expression,
    string,
    ...Statement(token),
  };
}

export function ExpressionStatement(token, expression) {
  function string() {
    return `${expression === null ? "" : expression.string()}`;
  }

  return {
    token,
    expression,
    string,
    ...Statement(token),
  };
}

// Bool instead of Boolean to not confuse with the built-in Boolean constructor
export function Bool(token, value) {
  function string() {
    return token.literal;
  }

  return {
    token,
    value,
    string,
    ...Expression(token),
  };
}

export function IfExpression(token, condition, consequence, alternative) {
  function string() {
    let ifExpressionString = `if${condition.string()} ${consequence.string()}`;

    if (alternative !== null) {
      ifExpressionString += `else ${alternative.string()}`;
    }

    return ifExpressionString;
  }

  return {
    token,
    condition,
    consequence,
    alternative,
    string,
    ...Expression(token),
  };
}

export function BlockStatement(token, statements) {
  function string() {
    let blockString = "";

    for (const statement of statements) {
      blockString += statement.string();
    }

    return blockString;
  }

  return {
    token,
    statements,
    string,
    ...Statement(token),
  };
}

export function FunctionLiteral(token, parameters, body) {
  function string() {
    return `${token.literal}(${parameters.map((param) => param.string()).join(", ")}) ${body.string()}`;
  }

  return {
    token,
    parameters,
    body,
    string,
    ...Expression(token),
  };
}

export function CallExpression(token, functionExpression, args) {
  function string() {
    return `${functionExpression.string()}(${args.map((arg) => arg.string()).join(", ")})`;
  }

  return {
    token,
    functionExpression,
    args,
    string,
    ...Expression(token),
  };
}

export function Program(statements) {
  function tokenLiteral() {
    if (statements.length > 0) {
      return statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  function string() {
    return statements.map((statement) => statement.string()).join("");
  }

  return {
    statements,
    tokenLiteral,
    string,
  };
}
