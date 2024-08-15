# interpreter-in-js
Following the book "[Writing An Interpreter In Go](https://interpreterbook.com/)" by Thorsten Ball using JavaScript.

## Installation
Git clone this project locally. `npm i` is NOT required to run the project except to run the test suite.

## Usage
### REPL
```
node index.js 
```

`-demo` flag is optional. This will additionally output the results of the lexer and the parser.

Example function you can try in the REPL:
```
let fibonacci = fn(n) {if (n < 1) {return 0}; if (n == 1) {return 1}; return fibonacci(n-1) + fibonacci(n-2);}
```

```
fibonacci(10)
```


