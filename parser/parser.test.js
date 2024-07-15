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
  console.log("Program string: ", program.string());
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
  console.log("Program string: ", program.string());
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

