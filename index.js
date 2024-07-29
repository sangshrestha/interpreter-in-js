import readline from "node:readline/promises";
import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";

while (true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question(">> ");

  const inputParser = Parser(Lexer(code));
  const inputProgram = inputParser.parseProgram();

  const parserErrors = inputParser.getErrors();

  if (parserErrors.length > 0) {
    console.error(parserErrors);
  }

  console.log(inputProgram.string());

  rl.close();
}
