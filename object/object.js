export const INTEGER_OBJ = "INTEGER";
export const STRING_OBJ = "STRING";
export const BOOLEAN_OBJ = "BOOLEAN";
export const NULL_OBJ = "NULL";
export const RETURN_VALUE_OBJ = "RETURN_VALUE";
export const ERR_OBJ = "ERR";
export const FUNCTION_OBJ = "FUNCTION";
export const BUILTIN_OBJ = "BUILTIN";
export const ARRAY_OBJ = "ARRAY";
export const HASH_OBJ = "HASH";

export class Integer {
  constructor(value) {
    this.value = value;
  }

  inspect() {
    return this.value.toString();
  }

  type() {
    return INTEGER_OBJ;
  }
}

export class StringLit {
  constructor(value) {
    this.value = value;
  }

  inspect() {
    return `"${this.value}"`;
  }

  type() {
    return STRING_OBJ;
  }
}

export class Bool {
  constructor(value) {
    this.value = value;
  }

  inspect() {
    return this.value.toString();
  }

  type() {
    return BOOLEAN_OBJ;
  }
}

export class Null {
  inspect() {
    return "KEKW";
  }

  type() {
    return NULL_OBJ;
  }
}

export class ReturnValue {
  constructor(value) {
    this.value = value;
  }

  inspect() {
    return this.value.inspect();
  }

  type() {
    return RETURN_VALUE_OBJ;
  }
}

export class Err {
  constructor(message) {
    this.message = message;
  }

  inspect() {
    return `ERROR: ${this.message}`;
  }

  type() {
    return ERR_OBJ;
  }
}

export class Function {
  constructor(parameters, body, environment) {
    this.parameters = parameters;
    this.body = body;
    this.environment = environment;
  }

  inspect() {
    const paramString = this.parameters
      .map((param) => param.string())
      .join(", ");

    return `fn(${paramString}) {
       ${this.body.string()}
}`;
  }

  type() {
    return FUNCTION_OBJ;
  }
}

export class Builtin {
  constructor(func) {
    this.func = func;
  }

  inspect() {
    return "builtin function";
  }

  type() {
    return BUILTIN_OBJ;
  }
}

export class Arr {
  constructor(elements) {
    this.elements = elements;
  }

  inspect() {
    const elString = this.elements.map((el) => el.inspect()).join(", ");
    return `[${elString}]`;
  }

  type() {
    return ARRAY_OBJ;
  }
}

export class HashPair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export class Hash {
  constructor(pairs) {
    this.pairs = pairs;
  }

  inspect() {
    const stringPairs = [];
    this.pairs.forEach((pair) =>
      stringPairs.push(`${pair.key.inspect()}: ${pair.value.inspect()}`),
    );
    return `{${stringPairs.join(", ")}}`;
  }

  type() {
    return HASH_OBJ;
  }
}

export function newEnvironment(outerEnv) {
  const store = {};

  function get(name) {
    let val = store[name];

    if (!val && outerEnv != null) {
      val = outerEnv.get(name);
    }

    return val;
  }

  function set(name, value) {
    store[name] = value;
    return value;
  }

  function see() {
    return store;
  }

  return {
    get,
    set,
    see,
  };
}
