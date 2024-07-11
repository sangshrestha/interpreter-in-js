import readline from "node:readline/promises";
import { Lexer } from "./lexer/lexer.js";

while (true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question(">> ");

  const inputLexer = Lexer(code);

  while (inputLexer.getChar() !== 0) {
    console.log(inputLexer.nextToken());
  }

  rl.close();
}
