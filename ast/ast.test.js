import { Identifier, LetStatement, Program } from "./ast";
import * as token from "../token/token.js";

describe("Program string output", () => {
  const statements = [
    new LetStatement(
      { type: token.LET, literal: "let" },
      new Identifier({ type: token.IDENT, literal: "myVar" }, "myVar"),
      new Identifier(
        { type: token.IDENT, literal: "anotherVar" },
        "anotherVar",
      ),
    ),
  ];
  const program = new Program(statements);

  it("outputs correct string", () => {
    expect(program.string()).toEqual("let myVar = anotherVar;");
  });
});
