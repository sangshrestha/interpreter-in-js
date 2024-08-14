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
  FunctionLiteral,
  CallExpression,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
} from "../ast/ast.js";
import {
  Arr,
  ARRAY_OBJ,
  Bool,
  BOOLEAN_OBJ,
  Builtin,
  Err,
  ERR_OBJ,
  Function,
  Hash,
  HASH_OBJ,
  HashPair,
  Integer,
  INTEGER_OBJ,
  newEnvironment,
  Null,
  RETURN_VALUE_OBJ,
  ReturnValue,
  STRING_OBJ,
  StringLit,
} from "../object/object.js";
import { BUILTINS } from "./builtins.js";

export const TRUE = new Bool(true);
export const FALSE = new Bool(false);
export const NULL = new Null();

export function evaluate(node, environment) {
  switch (node.constructor) {
    case Program:
      return evaluateProgram(node.statements, environment);

    case ExpressionStatement:
      return evaluate(node.expression, environment);

    case IntegerLiteral:
      return new Integer(node.value);

    case StringLiteral:
      return new StringLit(node.value);

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

    case FunctionLiteral:
      const params = node.parameters;
      const body = node.body;
      return new Function(params, body, environment);

    case CallExpression:
      const func = evaluate(node.functionExpression, environment);

      if (isErr(func)) {
        return func;
      }

      const args = evaluateExpressions(node.args, environment);

      if (args.length === 1 && isErr(args[0])) {
        return args[0];
      }

      return applyFunction(func, args);

    case ArrayLiteral:
      const els = evaluateExpressions(node.elements, environment);

      if (els.length === 1 && isErr(els[0])) {
        return els[0];
      }

      return new Arr(els);

    case IndexExpression:
      const leftExp = evaluate(node.leftExpression, environment);

      if (isErr(leftExp)) {
        return leftExp;
      }

      const ind = evaluate(node.index, environment);

      if (isErr(leftExp)) {
        return ind;
      }

      return evaluateIndexExpression(leftExp, ind);

    case HashLiteral:
      return evaluateHashLiteral(node, environment);

    case Identifier:
      return evaluateIdentifier(node, environment);

    case LetStatement:
      let identVal = evaluate(node.expression, environment);

      if (isErr(identVal)) {
        return identVal;
      } else if (identVal instanceof ReturnValue) {
        identVal = identVal.value;
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

  if (left.type() == STRING_OBJ && right.type() == STRING_OBJ) {
    switch (operator) {
      case "+":
        return new StringLit(left.value + right.value);
    }
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

  const builtin = BUILTINS[node.value];

  if (builtin) {
    return builtin;
  }

  return new Err(`identifier not found: ${node.value}`);
}

function evaluateExpressions(expressions, environment) {
  let result = [];

  expressions.forEach((expression) => {
    const evaluated = evaluate(expression, environment);

    if (isErr(evaluated)) {
      return [evaluated];
    }

    result.push(evaluated);
  });

  return result;
}

function applyFunction(func, args) {
  switch (func.constructor) {
    case Function:
      const extendedEnvironment = extendFunctionEnvironment(func, args);
      const evaluated = evaluate(func.body, extendedEnvironment);
      return unwrapReturnValue(evaluated);

    case Builtin:
      return func.func(...args);

    default:
      return new Err(`not a function: ${func.type()}`);
  }
}

function extendFunctionEnvironment(func, args) {
  const env = newEnvironment(func.environment);

  func.parameters.forEach((param, ind) => env.set(param.value, args[ind]));

  return env;
}

function unwrapReturnValue(obj) {
  if (obj instanceof ReturnValue) {
    return obj.value;
  }

  return obj;
}

function evaluateIndexExpression(leftExp, index) {
  if (leftExp.type() === ARRAY_OBJ && index.type() === INTEGER_OBJ) {
    return evaluateArrayIndexExpression(leftExp, index);
  }

  if (leftExp.type() === HASH_OBJ) {
    return evaluateHashIndexExpression(leftExp, index);
  }

  return new Err(`index operator not supported: ${leftExp.type()}`);
}

function evaluateArrayIndexExpression(arr, index) {
  const indexVal = index.value;
  const max = arr.elements.length - 1;

  if (indexVal < 0 || indexVal > max) {
    return NULL;
  }

  return arr.elements[indexVal];
}

function evaluateHashIndexExpression(hash, index) {
  if (!isHashable(index)) {
    return new Err(`unusable as hash key: ${index.type()}`);
  }

  const pair = hash.pairs.get(index.value);

  if (pair) {
    return pair.value;
  } else {
    return NULL;
  }
}

function evaluateHashLiteral(node, environment) {
  const hashMap = new Map();

  const iterator = node.pairs.entries();

  for (const pair of iterator) {
    const [key, value] = pair;

    const evalKey = evaluate(key, environment);
    if (isErr(evalKey)) {
      return evalKey;
    }

    const evalValue = evaluate(value, environment);
    if (isErr(evalKey)) {
      return evalKey;
    }

    if (!isHashable(evalKey)) {
      return new Err(`unusable as hash key: ${evalKey.type()}`);
    }

    const hashPair = new HashPair(evalKey, evalValue);
    hashMap.set(evalKey.value, hashPair);
  }

  return new Hash(hashMap);
}

function isHashable(object) {
  return [STRING_OBJ, INTEGER_OBJ, BOOLEAN_OBJ].includes(object.type());
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
