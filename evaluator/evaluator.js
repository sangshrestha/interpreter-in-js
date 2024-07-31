import {
  BooleanExpression,
  ExpressionStatement,
  IntegerLiteral,
  Program,
} from "../ast/ast.js";
import { Bool, Integer } from "../object/object.js";

const TRUE = new Bool(true);
const FALSE = new Bool(false);

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
  }

  return null;
}

function evaluateStatements(statements) {
  let result;

  for (const statement of statements) {
    result = evaluate(statement);
  }

  return result;
}
