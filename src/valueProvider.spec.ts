import { describe, expect, it } from "vitest";

import { defineValueProvider } from "./index";

const makeDeepProvider = () =>
  defineValueProvider<{
    deep: {
      deeper: {
        deepest: {
          value: string;
        };
      };
    };
  }>(async () => {
    return {
      deep: () => {
        return {
          deeper: {
            deepest: {
              value: async () => "hello",
            },
          },
        };
      },
    };
  });

describe("valueProvider", () => {
  // it("handles direct value", async () => {
  //   const sample = defineValueProvider<string>("test");
  //   expect(await sample.get("")).toBe("test");
  // });

  it("handles direct value", async () => {
    const sample = defineValueProvider<{
      stringValue: string;
      numberValue: number;
    }>({
      stringValue: "hello",
      numberValue: 42,
    });
    expect(await sample.get("stringValue")).toBe("hello");
    expect(await sample.get("numberValue")).toBe(42);
  });

  it("handles function value", async () => {
    const sample = defineValueProvider<{
      stringValue: string;
      numberValue: number;
    }>(() => ({
      stringValue: "hello",
      numberValue: 42,
    }));
    expect(await sample.get("stringValue")).toBe("hello");
    expect(await sample.get("numberValue")).toBe(42);
  });

  it("handles async value", async () => {
    const sample = defineValueProvider<{
      stringValue: string;
      numberValue: number;
    }>(async () => ({
      stringValue: "hello",
      numberValue: 42,
    }));
    expect(await sample.get("stringValue")).toBe("hello");
    expect(await sample.get("numberValue")).toBe(42);
  });

  it("handles inner values", async () => {
    const sample = defineValueProvider<{
      directValue: string;
      functionValue: string;
      asyncValue: string;
    }>({
      directValue: "direct hello",
      functionValue: () => "fn hello",
      asyncValue: async () => "async hello",
    });
    expect(await sample.get("directValue")).toBe("direct hello");
    expect(await sample.get("functionValue")).toBe("fn hello");
    expect(await sample.get("asyncValue")).toBe("async hello");
  });

  it("handles nested values", async () => {
    const sample = makeDeepProvider();
    expect(await sample.get("deep.deeper.deepest.value")).toBe("hello");
  });

  it("unwraps nested values", async () => {
    const sample = makeDeepProvider();
    expect(await sample.get("deep")).toEqual({
      deeper: {
        deepest: {
          value: "hello",
        },
      },
    });
  });

  it("unwraps", async () => {
    const sample = defineValueProvider<{
      nested: {
        value: string[];
      };
    }>({
      nested: () => ({
        value: () => ["hello", "world"],
      }),
    });
    expect(await sample.get()).toEqual({
      nested: {
        value: ["hello", "world"],
      },
    });
  });
});
