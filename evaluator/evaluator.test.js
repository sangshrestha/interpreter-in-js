import { expect } from "@jest/globals";

import { evaluate, NULL } from "../evaluator/evaluator.js";
import { createLexer } from "../lexer/lexer";
import { Integer, Bool, Err } from "../object/object.js";
import { createParser } from "../parser/parser";

describe.each([
  ["5", 5],
  ["10", 10],
  ["-5", -5],
  ["-10", -10],
  ["-(-5)", 5],
  ["-(-10)", 10],
  ["5 + 5 + 5 + 5 - 10", 10],
  ["2 * 2 * 2 * 2 * 2", 32],
  ["-50 + 100 + -50", 0],
  ["5 * 2 + 10", 20],
  ["5 + 2 * 10", 25],
  ["20 + 2 * -10", 0],
  ["50 / 2 * 2 + 10", 60],
  ["2 * (5 + 10)", 30],
  ["3 * 3 * 3 + 10", 37],
  ["3 * (3 * 3) + 10", 37],
  ["(5 + 10 * 2 + 15 / 3) * 2 + -10", 50],
])("Evaluate integer expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

describe.each([
  ["false", false],
  ["true", true],
  ["1 < 2", true],
  ["1 > 2", false],
  ["1 < 1", false],
  ["1 > 1", false],
  ["1 == 1", true],
  ["1 != 1", false],
  ["1 == 2", false],
  ["1 != 2", true],
  ["true == true", true],
  ["false == false", true],
  ["true == false", false],
  ["true != false", true],
  ["false != true", true],
  ["(1 < 2) == true", true],
  ["(1 < 2) == false", false],
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

describe.each([
  ["if (true) { 10 }", 10],
  ["if (false) { 10 }", null],
  ["if (1) { 10 }", 10],
  ["if (1 < 2) { 10 }", 10],
  ["if (1 > 2) { 10 }", null],
  ["if (1 > 2) { 10 } else { 20 }", 20],
  ["if (1 < 2) { 10 } else { 20 }", 10],
])("Evaluate if else expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  if (typeof expected === "number") {
    testIntegerObject(evaluated, expected);
  } else {
    testNullObject(evaluated);
  }
});

describe.each([
  ["return 10;", 10],
  ["return 10; 9;", 10],
  ["return 2 * 5; 9;", 10],
  ["9; return 2 * 5; 9;", 10],
  ["if (10 > 1) {if (10 > 1) {return 10;} return 1;}", 10],
])("Evaluate return statement", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

describe.each([
  ["5 + true;", "type mismatch: INTEGER + BOOLEAN"],
  ["5 + true; 5;", "type mismatch: INTEGER + BOOLEAN"],
  ["-true", "unknown operator: -BOOLEAN"],
  ["true + false;", "unknown operator: BOOLEAN + BOOLEAN"],
  ["5; true + false; 5", "unknown operator: BOOLEAN + BOOLEAN"],
  ["if (10 > 1) { true + false; }", "unknown operator: BOOLEAN + BOOLEAN"],
  [
    "if (10 > 1) {if (10 > 1) {return true + false;}return 1;}",
    "unknown operator: BOOLEAN + BOOLEAN",
  ],
])("Evaluate error handling", (input, expected) => {
  const evaluated = testEvaluate(input);
  testErrorObject(evaluated, expected);
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

function testNullObject(object) {
  it("is null", () => {
    expect(object).toEqual(NULL);
  });
}

function testErrorObject(object, expected) {
  it("is an instance of Err", () => {
    expect(object instanceof Err).toEqual(true);
  });

  it("holds expected message", () => {
    expect(object.message).toEqual(expected);
  });
}
