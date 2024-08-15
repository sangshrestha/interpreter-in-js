import { expect } from "@jest/globals";

import { evaluate, NULL } from "../evaluator/evaluator.js";
import { createLexer } from "../lexer/lexer";
import {
  Integer,
  Bool,
  Err,
  newEnvironment,
  Function,
  StringLit,
  Arr,
  Hash,
} from "../object/object.js";
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
  ["'5'", "5"],
  ['"foo" + " " + "bar"', "foo bar"],
])("Evaluate string literal expression", (input, expected) => {
  const evaluated = testEvaluate(input);
  testStringObject(evaluated, expected);
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
  ["foobar", "identifier not found: foobar"],
  ['"hello" - "world"', "unknown operator: STRING - STRING"],
  ["let a = fn() {}; {a: 1}", "unusable as hash key: FUNCTION"],
  ['{"name": "Monkey"}[fn(x) { x }];', "unusable as hash key: FUNCTION"],
])("Evaluate error handling", (input, expected) => {
  const evaluated = testEvaluate(input);
  testErrorObject(evaluated, expected);
});

describe.each([
  ["let a = 5; a;", 5],
  ["let a = 5 * 5; a;", 25],
  ["let a = 5; let b = a; b;", 5],
  ["let a = 5; let b = a; let c = a + b + 5; c;", 15],
])("Evaluate let statement", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

describe.each([
  ["len('')", 0],
  ["len('four')", 4],
  ["len('hello world')", 11],
  ["len(1)", "argument to 'len' not supported, got INTEGER"],
  ["len('one', 'two')", "wrong number of arguments. got=2, want=1"],
])("Test built in function", (input, expected) => {
  const evaluated = testEvaluate(input);

  switch (typeof expected) {
    case "number":
      testIntegerObject(evaluated, expected);
      break;

    case "string":
      testErrorObject(evaluated, expected);
      break;
  }
});

describe("Test Function object", () => {
  const input = "fn(x) { x + 2; };";

  const evaluated = testEvaluate(input);

  it("is an instance of Function", () => {
    expect(evaluated instanceof Function).toEqual(true);
  });
});

describe.each([
  ["let identity = fn(x) { x; }; identity(5);", 5],
  ["let identity = fn(x) { return x; }; identity(5);", 5],
  ["let double = fn(x) { x * 2; }; double(5);", 10],
  ["let add = fn(x, y) { x + y; }; add(5, 5);", 10],
  ["let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", 20],
  ["fn(x) { x; }(5)", 5],
])("Evaluate function", (input, expected) => {
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, expected);
});

describe("Evaluate array literal", () => {
  const input = "[1, 2 * 3, 5 + 7]";
  const evaluated = testEvaluate(input);

  it("is an instance of Arr", () => {
    expect(evaluated instanceof Arr).toEqual(true);
  });

  const { elements } = evaluated;

  it("has expected number of elements", () => {
    expect(elements.length).toEqual(3);
  });

  testIntegerObject(elements[0], 1);
  testIntegerObject(elements[1], 6);
  testIntegerObject(elements[2], 12);
});

describe.each([
  ["[1, 2, 3][0]", 1],
  ["[1, 2, 3][1]", 2],
  ["[1, 2, 3][2]", 3],
  ["let i = 0; [1][i];", 1],
  ["[1, 2, 3][1 + 1];", 3],
  ["let myArray = [1, 2, 3]; myArray[2];", 3],
  ["let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", 6],
  ["let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i]", 2],
  ["[1, 2, 3][3]", null],
  ["[1, 2, 3][-1]", null],
])("Evaluate index expression", (input, expected) => {
  const evaluated = testEvaluate(input);

  if (typeof expected === "number") {
    testIntegerObject(evaluated, expected);
  } else {
    testNullObject(evaluated);
  }
});

describe("Test Closure", () => {
  const input = `
    let newAdder = fn(x) {
      fn(y) { x + y };
    };
    let addTwo = newAdder(2);
    addTwo(2);
  `;
  const evaluated = testEvaluate(input);
  testIntegerObject(evaluated, 4);
});

describe("Evaluate hash literal", () => {
  const input = `let two = "two";
  {
    "one": 10 - 9,
    two: 1 + 1,
    "thr" + "ee": 6 / 2,
    4: 4,
    true: 5,
    false: 6
  }`;

  const evaluated = testEvaluate(input);

  it("is an instance of Hash", () => {
    expect(evaluated instanceof Hash).toEqual(true);
  });

  const expected = [
    ["one", 1],
    ["two", 2],
    ["three", 3],
    [4, 4],
    [true, 5],
    [false, 6],
  ];

  const { pairs } = evaluated;

  it("has expected amount of pairs", () => {
    expect(pairs.size).toEqual(expected.length);
  });

  expected.forEach(([expectedKey, expectedValue]) => {
    const pair = pairs.get(expectedKey);
    testIntegerObject(pair.value, expectedValue);
  });
});

describe.each([
  ["{'foo': 5}['foo']", 5],
  ["{'foo': 5}['bar']", null],
  ["let key = 'foo'; {'foo': 5}[key]", 5],
  ["{}['foo']", null],
  ["{5: 5}[5]", 5],
  ["{true: 5}[true]", 5],
  ["{false: 5}[false]", 5],
])("Evaluate hash index expression", (input, expected) => {
  const evaluated = testEvaluate(input);

  if (typeof expected === "number") {
    testIntegerObject(evaluated, expected);
  } else {
    testNullObject(evaluated);
  }
});

function testEvaluate(input) {
  const parser = createParser(createLexer(input));
  const program = parser.parseProgram();
  const env = newEnvironment();

  return evaluate(program, env);
}

function testIntegerObject(object, expected) {
  it("is an instance of Integer", () => {
    expect(object instanceof Integer).toEqual(true);
  });

  it("holds expected value", () => {
    expect(object.value).toEqual(expected);
  });
}

function testStringObject(object, expected) {
  it("is an instance of StringLit", () => {
    expect(object instanceof StringLit).toEqual(true);
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
