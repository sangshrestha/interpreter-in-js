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
})

