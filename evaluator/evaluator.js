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
  LetStatement,
  Identifier,
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

export function evaluate(node, environment) {
  switch (node.constructor) {
    case Program:
      return evaluateProgram(node.statements, environment);

    case ExpressionStatement:
      return evaluate(node.expression, environment);

    case IntegerLiteral:
      return new Integer(node.value);

    case BooleanExpression:
      return node.value ? TRUE : FALSE;

    case PrefixExpression:
      const right = evaluate(node.rightExpression, environment);

      if (isErr(right)) {
        return right;
      }
      return evaluatePrefixExpression(node.operator, right);

    case InfixExpression:
      const infixLeft = evaluate(node.leftExpression, environment);

      if (isErr(infixLeft)) {
        return infixLeft;
      }

      const infixRight = evaluate(node.rightExpression, environment);

      if (isErr(infixRight)) {
        return infixRight;
      }

      return evaluateInfixExpression(infixLeft, node.operator, infixRight);

    case BlockStatement:
      return evaluateBlockStatement(node.statements, environment);

    case IfExpression:
      return evaluateIfExpression(node, environment);

    case ReturnStatement:
      const returnVal = evaluate(node.expression, environment);

      if (isErr(returnVal)) {
        return returnVal;
      }

      return new ReturnValue(returnVal);

    case Identifier:
      return evaluateIdentifier(node, environment);

    case LetStatement:
      const identVal = evaluate(node.expression, environment);

      if (isErr(identVal)) {
        return identVal;
      }

      return environment.set(node.identifier.value, identVal);
  }

  return NULL;
}

function evaluateProgram(statements, environment) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement, environment);

    switch (result.constructor) {
      case ReturnValue:
        return result.value;

      case Err:
        return result;
    }
  }

  return result;
}

function evaluateBlockStatement(statements, environment) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement, environment);

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

function evaluateIfExpression(node, environment) {
  const { condition, consequence, alternative } = node;
  const evalCondition = evaluate(condition, environment);

  if (isErr(evalCondition)) {
    return evalCondition;
  }

  if (isTruthy(evalCondition)) {
    return evaluate(consequence, environment);
  } else if (alternative !== null) {
    return evaluate(alternative, environment);
  } else {
    return NULL;
  }
}

function evaluateIdentifier(node, environment) {
  const val = environment.get(node.value);

  if (val) {
    return val;
  }

  return new Err(`identifier not found: ${node.value}`);
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
