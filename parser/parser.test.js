import { Parser } from "./parser";
import { Lexer } from "../lexer/lexer";

describe("Parse let statements", () => {
  const input = `
let x = 5;
let y = 10;
let foobar = 384783;
`
  const expectedIdentifiers = ["x", "y", "foobar"];

  const program = Parser(Lexer(input)).parseProgram();

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

