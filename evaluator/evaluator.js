import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  Program,
} from "../ast/ast.js";
import { Bool, Integer, Null } from "../object/object.js";

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

  switch (operator) {
    case "!":
      return evaluateBangOperatorExpression(right);

    default:
      return NULL;
  }
}
