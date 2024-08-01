export const INTEGER_OBJ = "INTEGER";
export const BOOLEAN_OBJ = "BOOLEAN";
export const NULL_OBJ = "NULL";

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
    return "null";
  }

  type() {
    return NULL_OBJ;
  }
}
