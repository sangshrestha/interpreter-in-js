import { Parser } from "./parser";
import { Lexer } from "../lexer/lexer";

describe.each([
  ["let x = 5;", "x", 5],
  ["let foobar = true;", "foobar", true],
])("Parse let statements", (input, ident, _) => {
  const parser = Parser(Lexer(input));
  checkParserErrors(parser);

  const program = parser.parseProgram();

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const statement = program.statements[0];

  it("outputs expected token literal", () => {
    expect(statement.tokenLiteral()).toEqual("let");
  });

  it("outputs expected identifier value", () => {
    expect(statement.identifier.value).toEqual(ident);
  });

  it("outputs expected identifier token literal", () => {
    expect(statement.identifier.tokenLiteral()).toEqual(ident);
  });

  it.todo("outputs expected value");
});

describe.each([
  ["return 5;", 5],
  ["return true;", true],
])("Parse return statements", (input, _) => {
  const parser = Parser(Lexer(input));
  checkParserErrors(parser);

  const program = parser.parseProgram();

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const statement = program.statements[0];

  it("outputs expected token literal", () => {
    expect(statement.tokenLiteral()).toEqual("return");
  });

  it.todo("outputs expected value");
});

describe.each([
  ["foobar;", "foobar"],
  ["a;", "a"],
])("Parse identifier expression", (input, ident) => {
  const parser = Parser(Lexer(input));
  checkParserErrors(parser);

  const program = parser.parseProgram();

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
  checkParserErrors(parser);

  const program = parser.parseProgram();

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  testIntegerLiteral(expression, value);
});

describe.each([
  ["!foobar;", "!", "foobar"],
  ["-15;", "-", 15],
])("Parse prefix expressions", (input, operator, value) => {
  const parser = Parser(Lexer(input));
  checkParserErrors(parser);

  const program = parser.parseProgram();

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  it("outputs correct operator", () => {
    expect(expression.operator).toEqual(operator);
  });

  testLiteralExpression(expression.rightExp, value);
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
])("Parse infix expressions", (input, leftVal, operator, rightVal) => {
  const parser = Parser(Lexer(input));
  checkParserErrors(parser);

  const program = parser.parseProgram();

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  });

  const { expression } = program.statements[0];

  testInfixExpression(expression, leftVal, operator, rightVal);
});

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
])("Operator precedence", (input, expected) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected program string", () => {
    expect(program.string()).toEqual(expected);
  });
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
  it("outputs expected integer value", () => {
    expect(expression.value).toEqual(value);
  });

  it("outputs expected token literal", () => {
    expect(expression.tokenLiteral()).toEqual(value.toString());
  });
}

function testIdentifier(expression, value) {
  it("outputs expected identifier value", () => {
    expect(expression.value).toEqual(value);
  });

  it("outputs expected token literal", () => {
    expect(expression.tokenLiteral()).toEqual(value);
  });
}

function testLiteralExpression(expression, expected) {
  switch (typeof expected) {
    case "number":
      return testIntegerLiteral(expression, expected);

    case "string":
      return testIdentifier(expression, expected);
  }

  throw new Error(`type of expected: ${typeof expected} not handled`);
}

function testInfixExpression(expression, leftVal, operator, rightVal) {
  testLiteralExpression(expression.leftExp, leftVal);

  it("outputs correct operator", () => {
    expect(expression.operator).toEqual(operator);
  });

  testLiteralExpression(expression.rightExp, rightVal);

  it("outputs correct value", () => {
    expect(expression.rightExp.value).toEqual(value);
  });

  it("outputs correct token literal", () => {
    expect(expression.rightExp.tokenLiteral()).toEqual(value.toString());
  });
}
