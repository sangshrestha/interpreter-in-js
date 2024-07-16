import { Identifier, LetStatement, Program } from "./ast";
import * as token from "../token/token.js";

describe("Program string output", () => {
  const statements = [
    LetStatement(
      { type: token.LET, literal: "let" },
      Identifier(
        { type: token.IDENT, literal: "myVar" },
        "myVar",
      ),
      Identifier(
        { type: token.IDENT, literal: "anotherVar" },
        "anotherVar",
      )
    )
  ]
  const program = Program(statements);

  it("outputs correct string", () => {
    expect(program.string()).toEqual("let myVar = anotherVar;");
  })
})
