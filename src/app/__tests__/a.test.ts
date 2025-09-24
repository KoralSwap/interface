const add = (a: number, b: number): number => a + b;

describe("add", () => {
  test("adds with zero correctly", () => {
    expect(add(4, 0)).toBe(4);
  });
});
