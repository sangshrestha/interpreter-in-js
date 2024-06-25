class Lexer {
  #input;

  constructor(input) {
    this.#input = input;
    this.index = 0;
    this.readIndex = 1;
  }

  get input() {
    return this.#input;
  }

  get ch() {
    if (this.readIndex > this.#input.length) {
      return 0;
    } else {
      return this.#input.charCodeAt(this.index);
    }
  }

  readChar() {
    this.index = this.readIndex;
    this.readIndex += 1;
  }
}
