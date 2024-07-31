// Abstract Syntax Tree

export class Node {
  constructor(token) {
    this.token = token;
  }

  tokenLiteral() {
    if (this.token && this.token.literal) {
      return this.token.literal;
    } else {
      return "";
    }
  }
}

export class Statement extends Node {}
export class Expression extends Node {}

export class Identifier extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  string() {
    return this.value;
  }
}

export class IntegerLiteral extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  string() {
    return this.token.literal;
  }
}

export class LetStatement extends Statement {
  constructor(token, identifier, expression) {
    super();
    this.token = token;
    this.identifier = identifier;
    this.expression = expression;
  }

  string() {
    return `${this.token.literal} ${this.identifier.string()} = ${this.expression ? this.expression.string() : ""};`;
  }
}

export class ReturnStatement extends Statement {
  constructor(token, expression) {
    super();
    this.token = token;
    this.expression = expression;
  }

  string() {
    return `${this.token.literal} ${this.expression ? this.expression.string() : ""};`;
  }
}

export class ExpressionStatement extends Statement {
  constructor(token, expression) {
    super();
    this.token = token;
    this.expression = expression;
  }

  string() {
    return `${this.expression ? this.expression.string() : ""}`;
  }
}

export class PrefixExpression extends Expression {
  constructor(token, operator, rightExpression) {
    super();
    this.token = token;
    this.operator = operator;
    this.rightExpression = rightExpression;
  }

  string() {
    return `(${this.operator}${this.rightExpression.string()})`;
  }
}

export class InfixExpression extends Expression {
  constructor(token, leftExpression, operator, rightExpression) {
    super();
    this.token = token;
    this.leftExpression = leftExpression;
    this.operator = operator;
    this.rightExpression = rightExpression;
  }

  string() {
    return `(${this.leftExpression.string()} ${this.operator} ${this.rightExpression.string()})`;
  }
}

// Bool instead of Boolean to not confuse with the built-in Boolean constructor
export class Bool extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  string() {
    return this.token.literal;
  }
}

export class IfExpression extends Expression {
  constructor(token, condition, consequence, alternative) {
    super();
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  string() {
    let str = `if${this.condition.string()} ${this.consequence.string()}`;

    if (this.alternative) {
      str += `else ${this.alternative.string()}`;
    }

    return str;
  }
}

export class BlockStatement extends Statement {
  constructor(token, statements) {
    super();
    this.token = token;
    this.statements = statements;
  }

  string() {
    let str = "";

    for (const statement of this.statements) {
      str += statement.string();
    }

    return str;
  }
}

export class FunctionLiteral extends Expression {
  constructor(token, parameters, body) {
    super();
    this.token = token;
    this.parameters = parameters;
    this.body = body;
  }

  string() {
    let paramStr = this.parameters.map((param) => param.string()).join(", ");

    return `${this.token.literal}(${paramStr}) ${this.body.string()}`;
  }
}

export class CallExpression extends Expression {
  constructor(token, functionExpression, args) {
    super();
    this.token = token;
    this.functionExpression = functionExpression;
    this.args = args;
  }

  string() {
    let argsStr = this.args.map((arg) => arg.string()).join(", ");

    return `${this.functionExpression.string()}(${argsStr})`;
  }
}

export class Program extends Node {
  constructor(statements) {
    super();
    this.statements = statements;
    this.token = statements.length > 0 ? statements[0].token : null;
  }

  string() {
    return this.statements.map((statement) => statement.string()).join("");
  }
}
