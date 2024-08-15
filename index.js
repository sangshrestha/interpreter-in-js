import readline from "node:readline/promises";
import { argv } from "node:process";

import { createLexer } from "./lexer/lexer.js";
import { createParser } from "./parser/parser.js";
import { evaluate } from "./evaluator/evaluator.js";
import { newEnvironment } from "./object/object.js";
import { EOF } from "./token/token.js";

const env = newEnvironment();

while (true) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await rl.question(">> ");

  const inputParser = createParser(createLexer(code));
  const inputProgram = inputParser.parseProgram();

  const parserErrors = inputParser.getErrors();

  if (parserErrors.length > 0) {
    console.error(parserErrors);
  }

  const evaluated = evaluate(inputProgram, env);

  if (evaluated != null) {
    if (argv[2] === "-demo") {
      const demoLexer = createLexer(code);
      const tokens = [];
      let endOfToken = false;

      while (!endOfToken) {
        let token = demoLexer.nextToken();
        if (token.type === EOF) {
          endOfToken = true;
        }
        tokens.push(token);
      }
      console.log("Lexer: ", tokens, "\n");

      const demoParser = createParser(createLexer(code));
      const demoProgram = demoParser.parseProgram();
      console.log("Parser: ", demoProgram.statements, "\n");

      console.log("Evaluated object: ", evaluated, "\n");
    }
    console.log(evaluated.inspect());
  }

  rl.close();
}
