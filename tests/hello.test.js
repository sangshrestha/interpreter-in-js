import { hello } from "#root/index.js";

describe("Initial test", () => {
  it('prints "world"', () => {
    expect(hello()).toBe("world");
  });
});
