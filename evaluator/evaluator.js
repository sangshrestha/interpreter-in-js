import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
  Program,
  IfExpression,
  BlockStatement,
  ReturnStatement,
} from "../ast/ast.js";
import {
  Bool,
  Integer,
  INTEGER_OBJ,
  Null,
  RETURN_VALUE_OBJ,
  ReturnValue,
} from "../object/object.js";

const TRUE = new Bool(true);
const FALSE = new Bool(false);
export const NULL = new Null();

export function evaluate(node) {
  switch (node.constructor) {
    case Program:
      return evaluateProgram(node.statements);

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

    case BlockStatement:
      return evaluateBlockStatement(node.statements);

    case IfExpression:
      return evaluateIfExpression(node);

    case ReturnStatement:
      const returnVal = evaluate(node.expression);
      return new ReturnValue(returnVal);
  }

  return NULL;
}

function evaluateProgram(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);

    if (result instanceof ReturnValue) {
      return result.value;
    }
  }

  return result;
}

function evaluateBlockStatement(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);

    if (result !== null && result.type() === RETURN_VALUE_OBJ) {
      return result;
    }
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

function evaluateIfExpression(node) {
  const { condition, consequence, alternative } = node;
  const evalCondition = evaluate(condition);

  if (isTruthy(evalCondition)) {
    return evaluate(consequence);
  } else if (alternative !== null) {
    return evaluate(alternative);
  } else {
    return NULL;
  }
}

function isTruthy(object) {
  switch (object) {
    case NULL:
      return false;

    case TRUE:
      return true;

    case FALSE:
      return false;

    default:
      return true;
  }
}
