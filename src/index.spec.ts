import { describe, expect, it } from "vitest";

import { get } from "./index";

const sample = {
  number: 42,
  string: "hello",
  array: ["hello", "world", 42],
  object: {
    name: "bob",
    age: 42,
  },
  deep: {
    deeper: {
      deepest: {
        value: "deeply nested",
      },
    },
  },
};

describe("get", () => {
  it("root", async () => {
    expect(await get(sample)).toBe(sample);
  });
  it("number", async () => {
    expect(await get(sample, "number")).toBe(42);
  });
  it("string", async () => {
    expect(await get(sample, "string")).toBe("hello");
  });
  it("array", async () => {
    expect(await get(sample, "array")).toEqual(["hello", "world", 42]);
  });
  it("object", async () => {
    expect(await get(sample, "object")).toEqual({
      name: "bob",
      age: 42,
    });
  });
  it("nested value", async () => {
    expect(await get(sample, "object.name")).toBe("bob");
    expect(await get(sample, "object.age")).toBe(42);
  });
  it("deeply nested value", async () => {
    expect(await get(sample, "deep.deeper.deepest.value")).toBe(
      "deeply nested"
    );
  });
});
