import { Parser } from "./parser";
import { Lexer } from "../lexer/lexer";

function checkParserErrors(parser) {
  const errors = parser.getErrors();

  if (errors.length > 0) {
    throw new Error(`Parser encountered ${errors.length} errors:\n${errors.join("\n")}`)
  }
}

describe("Parse let statements", () => {
  const input = `
let x  = 5;
let y = 10;
let foobar = 384783;
`
  const expectedIdentifiers = ["x", "y", "foobar"];

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(expectedIdentifiers.length)
  })

  it("outputs token literal 'let'", () => {
    program.statements.forEach(statement => {
      expect(statement.tokenLiteral()).toEqual("let")
    });
  })

  it("outputs correct identifiers", () => {
    program.statements.forEach((statement, index) => {
      expect(statement.identifier.value).toEqual(expectedIdentifiers[index])
    });
  })

  it("outputs correct identifier token literals", () => {
    program.statements.forEach((statement, index) => {
      expect(statement.identifier.tokenLiteral()).toEqual(expectedIdentifiers[index])
    });
  })
})

describe("Parse return statements", () => {
  const input = `
return 5;
return 10;
return 2993892;
`
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(3)
  })

  it("outputs token literal 'return'", () => {
    program.statements.forEach(statement => {
      expect(statement.tokenLiteral()).toEqual("return")
    });
  })
})

describe("Parse identifier expression", () => {
  const input = "foobar;"

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  })

  it("outputs correct identifier value", () => {
    program.statements.forEach(statement => {
      expect(statement.expression.value).toEqual("foobar");
    });
  })

  it("outputs correct token literal", () => {
    program.statements.forEach(statement => {
      expect(statement.expression.tokenLiteral()).toEqual("foobar");
    });
  })
})

describe("Parse integer literal expression", () => {
  const input = "5;"

  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  })

  it("outputs correct identifier value", () => {
    program.statements.forEach(statement => {
      expect(statement.expression.value).toEqual(5);
    });
  })

  it("outputs correct token literal", () => {
    program.statements.forEach(statement => {
      expect(statement.expression.tokenLiteral()).toEqual("5");
    });
  })
})

describe("Parse prefix expressions", () => {
  const tests = [
    { input: "!foobar;", operator: "!", value: "foobar" },
    { input: "-15;", operator: "-", value: 15 }
  ];

  tests.forEach(test => {
    const parser = Parser(Lexer(test.input));
    const program = parser.parseProgram();
    checkParserErrors(parser);

    it("outputs expected number of statements", () => {
      expect(program.statements.length).toEqual(1);
    })

    it("outputs correct operator", () => {
      expect(program.statements[0].expression.operator).toEqual(test.operator);
    })

    it("outputs correct value", () => {
      expect(program.statements[0].expression.rightExp.value).toEqual(test.value);
    })

    it("outputs correct token literal", () => {
      expect(program.statements[0].expression.rightExp.tokenLiteral()).toEqual(test.value.toString());
    })

  })
})

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
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected number of statements", () => {
    expect(program.statements.length).toEqual(1);
  })

  it("outputs correct operator", () => {
    expect(program.statements[0].expression.operator).toEqual(operator);
  })

  it("outputs correct left value", () => {
    expect(program.statements[0].expression.leftExp.value).toEqual(leftVal);
  })

  it("outputs correct left value literal", () => {
    expect(program.statements[0].expression.leftExp.tokenLiteral()).toEqual(leftVal.toString());
  })

  it("outputs correct right value", () => {
    expect(program.statements[0].expression.rightExp.value).toEqual(rightVal);
  })

  it("outputs correct right value literal", () => {
    expect(program.statements[0].expression.rightExp.tokenLiteral()).toEqual(rightVal.toString());
  })
})

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
  ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"]
])("Operator precedence", (input, expected) => {
  const parser = Parser(Lexer(input));
  const program = parser.parseProgram();
  checkParserErrors(parser);

  it("outputs expected program string", () => {
    expect(program.string()).toEqual(expected);
  })
})
