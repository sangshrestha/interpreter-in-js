import { Parser } from "./parser";
import { Lexer } from "../lexer/lexer";
import {
  Bool,
  CallExpression,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
} from "../ast/ast";

describe.each([
  ["let x = 5;", "x", 5],
  ["let foobar = true;", "foobar", true],
])("Parse let statements", (input, ident, value) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const statement = program.statements[0];

  it("is an instance of LetStatement", () => {
    expect(statement instanceof LetStatement).toEqual(true);
  });

  it("outputs expected token literal", () => {
    expect(statement.tokenLiteral()).toEqual("let");
  });

  it("outputs expected identifier value", () => {
    expect(statement.identifier.value).toEqual(ident);
  });

  it("outputs expected identifier token literal", () => {
    expect(statement.identifier.tokenLiteral()).toEqual(ident);
  });

  testLiteralExpression(statement.expression, value);
});

describe.each([
  ["return 5;", 5],
  ["return false;", false],
])("Parse return statements", (input, value) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const statement = program.statements[0];

  it("is an instance of ReturnStatement", () => {
    expect(statement instanceof ReturnStatement).toEqual(true);
  });

  it("outputs expected token literal", () => {
    expect(statement.tokenLiteral()).toEqual("return");
  });

  testLiteralExpression(statement.expression, value);
});

describe.each([
  ["foobar;", "foobar"],
  ["a;", "a"],
])("Parse identifier expression", (input, ident) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  testIdentifier(expression, ident);
});

describe.each([
  ["5;", 5],
  ["10000;", 10000],
])("Parse integer literal expression", (input, value) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];
  testIntegerLiteral(expression, value);
});

describe.each([
  ["!foobar;", "!", "foobar"],
  ["-15;", "-", 15],
  ["!true;", "!", true],
  ["!false;", "!", false],
])("Parse prefix expressions", (input, operator, value) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  it("is an instance of PrefixExpression", () => {
    expect(expression instanceof PrefixExpression).toEqual(true);
  });

  it("outputs correct operator", () => {
    expect(expression.operator).toEqual(operator);
  });

  testLiteralExpression(expression.rightExpression, value);
});

describe.each([
  ["7 + 5;", 7, "+", 5],
  ["7 - 5;", 7, "-", 5],
  ["7 * 5;", 7, "*", 5],
  ["7 / 5;", 7, "/", 5],
  ["7 > 5;", 7, ">", 5],
  ["7 < 5;", 7, "<", 5],
  ["7 == 5;", 7, "==", 5],
  ["7 != 5;", 7, "!=", 5],
  ["true == true", true, "==", true],
  ["true != false", true, "!=", false],
  ["false == false", false, "==", false],
])("Parse infix expressions", (input, leftVal, operator, rightVal) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];
  testInfixExpression(expression, leftVal, operator, rightVal);
});

describe.each([["true;", true]])(
  "Parse boolean expressions",
  (input, value) => {
    const parser = Parser(Lexer(input));
    const program = parser.parseProgram();
    checkParserErrors(parser);

    it("outputs expected number of statements", () => {
      expect(program.statements.length).toEqual(1);
    });

    const { expression } = program.statements[0];
    testLiteralExpression(expression, value);
  },
);

describe.each([
  ["-a * b", "((-a) * b)"],
  ["!-a", "(!(-a))"],
  ["a + b + c", "((a + b) + c)"],
  ["a + b - c", "((a + b) - c)"],
  ["a * b * c", "((a * b) * c)"],
  ["a * b / c", "((a * b) / c)"],
  ["a + b / c", "(a + (b / c))"],
  ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
  ["3 + 4; -5 * 5", "(3 + 4)((-5) * 5)"],
  ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
  ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
  ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
  ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
  ["true", "true"],
  ["false", "false"],
  ["3 > 5 == false", "((3 > 5) == false)"],
  ["3 < 5 == true", "((3 < 5) == true)"],
  ["1 + (2 + 3) + 4", "((1 + (2 + 3)) + 4)"],
  ["(5 + 5) * 2", "((5 + 5) * 2)"],
  ["2 / (5 + 5)", "(2 / (5 + 5))"],
  ["-(5 + 5)", "(-(5 + 5))"],
  ["!(true == true)", "(!(true == true))"],
])("Operator precedence", (input, expected) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected program string", () => {
    expect(program.string()).toEqual(expected);
  });
});

describe("Parse if expression", () => {
  const input = "if (x < y) { x; }";

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  it("is an instance of IfExpression", () => {
    expect(expression instanceof IfExpression).toEqual(true);
  });

  testInfixExpression(expression.condition, "x", "<", "y");

  it("outputs expected number of consequences", () => {
    expect(expression.consequence.statements.length).toEqual(1);
  });

  testIdentifier(expression.consequence.statements[0].expression, "x");

  it("outputs null alternative", () => {
    expect(expression.alternative).toEqual(null);
  });
});

describe("Parse if else expression", () => {
  const input = "if (x > y) { x; } else { y; }";

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  testInfixExpression(expression.condition, "x", ">", "y");

  it("outputs expected number of consequences", () => {
    expect(expression.consequence.statements.length).toEqual(1);
  });

  testIdentifier(expression.consequence.statements[0].expression, "x");

  it("outputs expected number of alternatives", () => {
    expect(expression.alternative.statements.length).toEqual(1);
  });

  testIdentifier(expression.alternative.statements[0].expression, "y");
});

describe("Parse function literal", () => {
  const input = "fn(a, b) { a + b; }";

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  it("is an instance of FunctionLiteral", () => {
    expect(expression instanceof FunctionLiteral).toEqual(true);
  });

  it("outputs expected number of parameters", () => {
    expect(expression.parameters.length).toEqual(2);
  });

  testInfixExpression(expression.body.statements[0].expression, "a", "+", "b");
});

describe.each([
  ["fn() {};", []],
  ["fn(tu) {};", ["tu"]],
  ["fn(s, a, n, g) {}", ["s", "a", "n", "g"]],
])("Parse function parameters", (input, expected) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  const { parameters } = program.statements[0].expression;

  it("outputs expected number of parameters", () => {
    expect(parameters.length).toEqual(expected.length);
  });

  expected.forEach((identifier, index) => {
    testLiteralExpression(parameters[index], identifier);
  });
});

describe("Parse call expression", () => {
  const input = "add(1, 2 * 3, 5 + 7);";

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  it("is an instance of CallExpression", () => {
    expect(expression instanceof CallExpression).toEqual(true);
  });

  testIdentifier(expression.functionExpression, "add");

  it("outputs expected number of arguments", () => {
    expect(expression.args.length).toEqual(3);
  });

  testLiteralExpression(expression.args[0], 1);
  testInfixExpression(expression.args[1], 2, "*", 3);
  testInfixExpression(expression.args[2], 5, "+", 7);
});

// Helper functions
function checkParserErrors(parser) {
  const errors = parser.getErrors();

  if (errors.length > 0) {
    throw new Error(
      `Parser encountered ${errors.length} errors:\n${errors.join("\n")}`,
    );
  }
}

function testIntegerLiteral(expression, value) {
  it("is an instance of IntegerLiteral", () => {
    expect(expression instanceof IntegerLiteral).toEqual(true);
  });

  it("outputs expected integer value", () => {
    expect(expression.value).toEqual(value);
  });

  it("outputs expected token literal", () => {
    expect(expression.tokenLiteral()).toEqual(value.toString());
  });
}

function testIdentifier(expression, value) {
  it("is an instance of Identifier", () => {
    expect(expression instanceof Identifier).toEqual(true);
  });

  it("outputs expected identifier value", () => {
    expect(expression.value).toEqual(value);
  });

  it("outputs expected token literal", () => {
    expect(expression.tokenLiteral()).toEqual(value);
  });
}

function testBool(expression, value) {
  it("is an instance of Bool", () => {
    expect(expression instanceof Bool).toEqual(true);
  });

  it("outputs expected boolean value", () => {
    expect(expression.value).toEqual(value);
  });

  it("outputs expected token literal", () => {
    expect(expression.tokenLiteral()).toEqual(value.toString());
  });
}

function testLiteralExpression(expression, expected) {
  switch (typeof expected) {
    case "number":
      return testIntegerLiteral(expression, expected);

    case "string":
      return testIdentifier(expression, expected);

    case "boolean":
      return testBool(expression, expected);
  }

  throw new Error(`type of expected: ${typeof expected} not handled`);
}

function testInfixExpression(expression, leftVal, operator, rightVal) {
  it("is an instance of InfixExpression", () => {
    expect(expression instanceof InfixExpression).toEqual(true);
  });

  testLiteralExpression(expression.leftExpression, leftVal);

  it("outputs correct operator", () => {
    expect(expression.operator).toEqual(operator);
  });

  testLiteralExpression(expression.rightExpression, rightVal);
}
