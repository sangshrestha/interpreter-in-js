export const INTEGER_OBJ = "INTEGER";
export const BOOLEAN_OBJ = "BOOLEAN";
export const NULL_OBJ = "NULL";
export const RETURN_VALUE_OBJ = "RETURN_VALUE";

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
