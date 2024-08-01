import { expect } from "@jest/globals";

import { evaluate } from "../evaluator/evaluator.js";
import { createLexer } from "../lexer/lexer";
import { Integer, Bool } from "../object/object.js";
import { createParser } from "../parser/parser";

describe.each([
  ["5", 5],
  ["10", 10],
  ["-5", -5],
  ["-10", -10],
  ["-(-5)", 5],
  ["-(-10)", 10],
])("Evaluate integer expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

describe.each([
  ["false", false],
  ["true", true],
])("Evaluate boolean expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  testBoolObject(evaluated, expected);
});

describe.each([
  ["!true", false],
  ["!false", true],
  ["!5", false],
  ["!!true", true],
  ["!!false", false],
  ["!!5", true],
])("Evaluate bang operator", (input, expected) => {
  const evaluated = testEvaluate(input);
  testBoolObject(evaluated, expected);
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

function testBoolObject(object, expected) {
  it("is an instance of Bool", () => {
    expect(object instanceof Bool).toEqual(true);
  });

  it("holds expected value", () => {
    expect(object.value).toEqual(expected);
  });
}
