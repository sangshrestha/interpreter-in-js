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
  Err,
  ERR_OBJ,
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

      if (isErr(right)) {
        return right;
      }
      return evaluatePrefixExpression(node.operator, right);

    case InfixExpression:
      const infixLeft = evaluate(node.leftExpression);

      if (isErr(infixLeft)) {
        return infixLeft;
      }

      const infixRight = evaluate(node.rightExpression);

      if (isErr(infixRight)) {
        return infixRight;
      }

      return evaluateInfixExpression(infixLeft, node.operator, infixRight);

    case BlockStatement:
      return evaluateBlockStatement(node.statements);

    case IfExpression:
      return evaluateIfExpression(node);

    case ReturnStatement:
      const returnVal = evaluate(node.expression);

      if (isErr(returnVal)) {
        return returnVal;
      }

      return new ReturnValue(returnVal);
  }

  return NULL;
}

function evaluateProgram(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);

    switch (result.constructor) {
      case ReturnValue:
        return result.value;

      case Err:
        return result;
    }
  }

  return result;
}

function evaluateBlockStatement(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);

    if (result !== null) {
      const resultType = result.type();
      if (resultType === ERR_OBJ || resultType === RETURN_VALUE_OBJ) {
        return result;
      }
    }
  }

  return result;
}
function isErr(object) {
  return object !== null && object.type() === ERR_OBJ;
}

function evaluatePrefixExpression(operator, right) {
  switch (operator) {
    case "!":
      return evaluateBangOperatorExpression(right);

    case "-":
      return evaluateMinusOperatorExpression(right);

    default:
      return new Err(`unknown operator: ${operator}${right.type()}`);
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
    return new Err(`unknown operator: -${object.type()}`);
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

  if (left.type() !== right.type()) {
    return new Err(`type mismatch: ${left.type()} ${operator} ${right.type()}`);
  }

  return new Err(
    `unknown operator: ${left.type()} ${operator} ${right.type()}`,
  );
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
      return new Err(
        `unknown operator: ${left.type()} ${operator} ${right.type()}`,
      );
  }
}

function evaluateIfExpression(node) {
  const { condition, consequence, alternative } = node;
  const evalCondition = evaluate(condition);

  if (isErr(evalCondition)) {
    return evalCondition;
  }

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
