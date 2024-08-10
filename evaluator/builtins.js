import { Builtin, Err, Integer, StringLit } from "../object/object.js";

function len(...obj) {
  if (obj.length !== 1) {
    return new Err(`wrong number of arguments. got=${obj.length}, want=1`);
  }

  const arg = obj[0];

  switch (arg.constructor) {
    case StringLit:
      return new Integer(arg.value.length);

    default:
      return new Err(`argument to 'len' not supported, got ${arg.type()}`);
  }
}

export const BUILTINS = {
  len: new Builtin(len),
};
