import { evaluate } from "../evaluator/evaluator.js";
import { createLexer } from "../lexer/lexer";
import { Integer } from "../object/object.js";
import { createParser } from "../parser/parser";

describe.each([
  ["5", 5],
  ["10", 10],
])("Evaluate integer expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

function testEvaluate(input) {
  const parser = createParser(createLexer(input));
  const program = parser.parseProgram();

  return evaluate(program);
}

function testIntegerObject(object, expected) {
  it("is an instance of Integer", () => {
    expect(object instanceof Integer).toEqual(true);
  });

  it("holds expected value", () => {
    expect(object.value).toEqual(expected);
  });
}
