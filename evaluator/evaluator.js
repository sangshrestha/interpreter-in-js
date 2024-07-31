import { ExpressionStatement, IntegerLiteral, Program } from "../ast/ast";
import { Integer } from "../object/object";

export function evaluate(node) {
  switch (node.constructor) {
    case Program:
      return evaluateStatements(node.statements);

    case ExpressionStatement:
      return evaluate(node.expression);

    case IntegerLiteral:
      return new Integer(node.value);
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
