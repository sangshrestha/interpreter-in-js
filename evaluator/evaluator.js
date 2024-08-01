import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  Program,
} from "../ast/ast.js";
import {
  Bool,
  BOOLEAN_OBJ,
  Integer,
  INTEGER_OBJ,
  Null,
} from "../object/object.js";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
const NULL = new Null();

export function evaluate(node) {
  switch (node.constructor) {
    case Program:
      return evaluateStatements(node.statements);

    case ExpressionStatement:
      return evaluate(node.expression);

    case IntegerLiteral:
      return new Integer(node.value);

    case BooleanExpression:
      return node.value ? TRUE : FALSE;

    case PrefixExpression:
      const right = evaluate(node.rightExpression);
      return evaluatePrefixExpression(node.operator, right);

    case InfixExpression:
      const infixLeft = evaluate(node.leftExpression);
      const infixRight = evaluate(node.rightExpression);
      return evaluateInfixExpression(infixLeft, node.operator, infixRight);
  }

  return NULL;
}

function evaluateStatements(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);
  }

  return result;
}

function evaluatePrefixExpression(operator, right) {
  switch (operator) {
    case "!":
      return evaluateBangOperatorExpression(right);

    case "-":
      return evaluateMinusOperatorExpression(right);

    default:
      return NULL;
  }
}

function evaluateBangOperatorExpression(object) {
  switch (object) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evaluateMinusOperatorExpression(object) {
  if (object.type() !== INTEGER_OBJ) {
    return NULL;
  }
  return new Integer(-object.value);
}

function evaluateInfixExpression(left, operator, right) {
  if (left.type() == INTEGER_OBJ && right.type() == INTEGER_OBJ) {
    return evaluateIntegerInfixExpression(left, operator, right);
  }

  if (operator === "==") {
    return left.value === right.value ? TRUE : FALSE;
  }

  if (operator === "!=") {
    return left.value !== right.value ? TRUE : FALSE;
  }

  return NULL;
}

function evaluateIntegerInfixExpression(left, operator, right) {
  switch (operator) {
    case "+":
      return new Integer(left.value + right.value);

    case "-":
      return new Integer(left.value - right.value);

    case "*":
      return new Integer(left.value * right.value);

    case "/":
      return new Integer(left.value / right.value);

    case "<":
      return left.value < right.value ? TRUE : FALSE;

    case ">":
      return left.value > right.value ? TRUE : FALSE;

    case "==":
      return left.value === right.value ? TRUE : FALSE;

    case "!=":
      return left.value !== right.value ? TRUE : FALSE;

    default:
      return NULL;
  }
}
