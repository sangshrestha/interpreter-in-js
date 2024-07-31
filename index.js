import readline from "node:readline/promises";
import { createLexer } from "./lexer/lexer.js";
import { createParser } from "./parser/parser.js";
import { evaluate } from "./evaluator/evaluator.js";

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

  const evaluated = evaluate(inputProgram);

  if (evaluated != null) {
    //const logerLexer = createLexer(code);
    //console.log("Lexer: ", logerLexer.nextToken());
    //
    //const loggerParserLexer = createLexer(code);
    //const loggerParser = createParser(loggerParserLexer);
    //const loggerProgram = loggerParser.parseProgram();
    //console.log("Parser: ", loggerProgram.statements);
    //
    //console.log("Eval: ", evaluated);

    console.log(evaluated.inspect());
  }

  rl.close();
}
