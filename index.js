import readline from "node:readline/promises";

import { Lexer } from "./lexer/lexer.js";

while (true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question(">> ");

  const inputLexer = new Lexer(code);

  while (inputLexer.char !== 0) {
    console.log(inputLexer.nextToken());
  }

  rl.close();
}
